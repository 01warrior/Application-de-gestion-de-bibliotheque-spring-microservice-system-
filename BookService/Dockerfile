FROM eclipse-temurin:17-jre-jammy
ARG JAR_FILE=target/*.jar
WORKDIR /app
# Je copie le JAR pré-build
COPY ${JAR_FILE} app.jar
# installation de netcat pour vérifier la disponibilité de MySQL avant le démarrage
USER root
RUN apt-get update && apt-get install -y --no-install-recommends netcat && rm -rf /var/lib/apt/lists/*

EXPOSE 8081
ENTRYPOINT ["sh", "-c", "until nc -z ${DB_HOST:-mysql} ${DB_PORT:-3306}; do echo 'Waiting for DB ${DB_HOST:-mysql}:${DB_PORT:-3306}'; sleep 2; done; exec java -jar /app/app.jar"]
