package ma.mundiapolis.apigateway.filter;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import ma.mundiapolis.apigateway.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitingFilter implements GlobalFilter, Ordered {

    @Autowired
    private JwtUtil jwtUtil;

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        String userId = "anonymous";

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            try {
                if (jwtUtil.validateToken(token)) {
                    userId = jwtUtil.extractUsername(token);
                }
            } catch (Exception e) {
                // J'ignore l'exception et je considère l'utilisateur comme anonyme
            }
        } else {
            // J'utilise l'adresse IP pour les utilisateurs anonymes
            userId = exchange.getRequest().getRemoteAddress() != null
                    ? exchange.getRequest().getRemoteAddress().getAddress().getHostAddress()
                    : "unknown";
        }

        Bucket bucket = resolveBucket(userId);
        if (bucket.tryConsume(1)) {
            return chain.filter(exchange);
        } else {
            exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
            return exchange.getResponse().setComplete();
        }
    }

    private Bucket resolveBucket(String userId) {
        return cache.computeIfAbsent(userId, this::createNewBucket);
    }

    private Bucket createNewBucket(String userId) {
        // Je limite à 10 requêtes par minute par utilisateur
        Bandwidth limit = Bandwidth.classic(10, Refill.greedy(10, Duration.ofMinutes(1)));
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    @Override
    public int getOrder() {
        return -50;
    }
}
