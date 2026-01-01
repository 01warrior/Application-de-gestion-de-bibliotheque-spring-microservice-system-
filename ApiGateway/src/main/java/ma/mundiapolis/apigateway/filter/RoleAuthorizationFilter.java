package ma.mundiapolis.apigateway.filter;

import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.Collection;

@Component
public class RoleAuthorizationFilter implements GlobalFilter, Ordered {

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getPath().value();
        HttpMethod method = exchange.getRequest().getMethod();

        return exchange.getPrincipal()
                .flatMap(principal -> {
                    if (principal instanceof Authentication auth) {
                        boolean isAdmin = hasRole(auth.getAuthorities(), "ADMIN");

                        // Admin only routes for modification
                        if ((path.startsWith("/api/books") || path.startsWith("/api/users"))
                                && (method == HttpMethod.POST || method == HttpMethod.PUT
                                        || method == HttpMethod.DELETE)) {
                            if (!isAdmin && !path.contains("/login") && !path.contains("/register")) {
                                exchange.getResponse().setStatusCode(HttpStatus.FORBIDDEN);
                                return exchange.getResponse().setComplete();
                            }
                        }
                    }
                    return chain.filter(exchange);
                })
                .switchIfEmpty(chain.filter(exchange));
    }

    private boolean hasRole(Collection<? extends GrantedAuthority> authorities, String role) {
        return authorities.stream()
                .anyMatch(a -> a.getAuthority().equals(role) || a.getAuthority().equals("ROLE_" + role));
    }

    @Override
    public int getOrder() {
        return 0;
    }
}
