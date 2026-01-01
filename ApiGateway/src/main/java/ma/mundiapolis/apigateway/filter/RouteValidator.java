package ma.mundiapolis.apigateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.function.Predicate;

@Component
public class RouteValidator {

        private static final Logger log = LoggerFactory.getLogger(RouteValidator.class);

        public static final List<String> openApiEndpoints = List.of(
                        "/api/users/register",
                        "/api/users/login",
                        "/eureka",
                        "/actuator");

        public Predicate<ServerHttpRequest> isSecured = request -> {
                String path = request.getURI().getPath();
                boolean matchesPublic = openApiEndpoints.stream()
                                .anyMatch(uri -> path.contains(uri));
                boolean isSecured = !matchesPublic;
                log.debug("RouteValidator: path='{}', matchesPublic={}, isSecured={}", path, matchesPublic, isSecured);
                return isSecured;
        };

}
