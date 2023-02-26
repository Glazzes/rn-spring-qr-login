FROM amazoncorretto:17-alpine
ENV SPRING_PROFILES_ACTIVE prod
WORKDIR /app
COPY build/libs/qr-login-0.0.1-SNAPSHOT.jar .
CMD ["java", "-jar", "qr-login-0.0.1-SNAPSHOT.jar"]
