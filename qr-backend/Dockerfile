FROM amazoncorretto:17
ENV SPRING_PROFILES_ACTIVE docker
WORKDIR /app
COPY build/libs/qr-login-0.0.1-SNAPSHOT.jar .
CMD ["java", "-jar", "qr-login-0.0.1-SNAPSHOT.jar"]