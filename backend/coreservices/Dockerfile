# ==========================================
# Stage 1: Build the Spring Boot Application
# ==========================================
# Use Maven with Eclipse Temurin JDK 25 as the build image
FROM maven:3.9.9-eclipse-temurin-25 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml file to download dependencies first (enhances caching)
COPY pom.xml .

# Download the dependencies (go-offline) to cache them
RUN mvn dependency:go-offline -B

# Copy the entire source code
COPY src ./src

# Build the application, packaging it as a WAR/JAR and skipping tests
RUN mvn clean package -DskipTests

# ==========================================
# Stage 2: Runtime Environment
# ==========================================
# Use a lightweight JRE 25 image for running the application
FROM eclipse-temurin:25-jre-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the built WAR/JAR artifact from the build stage to the runtime stage
# Since the packaging is 'war', we copy the generated .war file as app.war
COPY --from=build /app/target/*.war app.war

# Expose the application port (8001 as specified in application.properties)
EXPOSE 8001

# Run the Spring Boot application using Java
ENTRYPOINT ["java", "-jar", "app.war"]
