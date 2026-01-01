package ma.mundiapolis.apigateway.filter;

import ma.mundiapolis.apigateway.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.ReactiveSecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Collections;
import java.util.List;

@Component
public class AuthenticationFilter implements GlobalFilter, Ordered {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private RouteValidator routeValidator;

    private static final Logger log = LoggerFactory.getLogger(AuthenticationFilter.class);

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        String path = request.getPath().value();
        String method = request.getMethod().toString();

        log.info("=== AuthenticationFilter START === Path: {}, Method: {}", path, method);

        // Skip validation for public endpoints
        boolean isSecured = routeValidator.isSecured.test(request);
        log.debug("Route isSecured: {}", isSecured);

        if (isSecured) {
            String authHeader = request.getHeaders().getFirst(HttpHeaders.AUTHORIZATION);

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                log.debug("Missing or malformed Authorization header");
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            String token = authHeader.substring(7);

            try {
                log.debug("Validating token (prefix): {}",
                        token.length() > 20 ? token.substring(0, 20) + "..." : token);

                if (!jwtUtil.validateToken(token)) {
                    log.warn("Token validation failed (invalid token)");
                    exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                    return exchange.getResponse().setComplete();
                }

                String username = jwtUtil.extractUsername(token);
                String role = jwtUtil.extractRole(token);

                log.debug("Token valid for user='{}', role='{}'", username, role);

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username, null, Collections.singletonList(new SimpleGrantedAuthority(role)));

                return chain.filter(exchange)
                        .contextWrite(ReactiveSecurityContextHolder.withAuthentication(authToken));

            } catch (Exception e) {
                log.error("JWT validation error in AuthenticationFilter: {}", e.getMessage());
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
        }

        log.info("=== AuthenticationFilter: Route is PUBLIC, skipping validation ===");
        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -100; // run before Spring Security filters
    }
}
