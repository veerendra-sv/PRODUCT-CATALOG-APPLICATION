# ============================================================
# Dockerfile for: coreservices (Spring Boot 4.0.6 / Java 25)
# Packaging : WAR  (pom.xml line 14: <packaging>war</packaging>)
# Server Port: 8001 (application.properties: server.port=8001)
# Render-compatible multi-stage build
# ============================================================


# ─────────────────────────────────────────────────────────────
# STAGE 1 — BUILD
# Eclipse Temurin 25 + Maven 3.9.9: matches java.version=25
# in pom.xml. Using the exact same JDK in build and runtime
# prevents "class file has wrong version" errors on Render.
# ─────────────────────────────────────────────────────────────
FROM maven:3.9.9-eclipse-temurin-25 AS build

WORKDIR /app

# Copy pom.xml first so Maven can resolve & cache dependencies
# in a separate Docker layer. Subsequent builds skip this if
# pom.xml has not changed (faster Render rebuilds).
COPY pom.xml .

# Download all dependencies declared in pom.xml in batch mode.
# -B = non-interactive (required for CI / Docker environments).
RUN mvn dependency:go-offline -B

# Copy the full source tree AFTER dependency caching so that
# changing only source files does NOT invalidate the dep layer.
COPY src ./src

# Package the application.
# -DskipTests : skips unit tests (faster build, no test DB needed).
# The spring-boot-maven-plugin repackages the WAR into an
# executable, self-contained "fat WAR" that embeds Tomcat and
# can be launched with `java -jar` even though packaging=war.
RUN mvn clean package -DskipTests


# ─────────────────────────────────────────────────────────────
# STAGE 2 — RUNTIME
# eclipse-temurin:25-jre-alpine is the smallest official JRE 25
# image (~90 MB). Alpine is Render-compatible and reduces attack
# surface versus the full JDK image used in Stage 1.
# ─────────────────────────────────────────────────────────────
FROM eclipse-temurin:25-jre-alpine

WORKDIR /app

# Copy ONLY the executable fat-WAR produced by the build stage.
# The wildcard *.war matches:
#   target/coreservices-0.0.1-SNAPSHOT.war
# and renames it to the predictable name app.war.
COPY --from=build /app/target/*.war app.war

# Tell Docker (and Render) which port the app listens on.
# This matches server.port=8001 in application.properties.
# On Render, traffic is routed to this port automatically when
# you set the "Port" field in your Web Service to 8001.
EXPOSE 8001

# Launch the executable fat-WAR.
# The spring-boot-maven-plugin embeds Tomcat inside the WAR, so
# `java -jar app.war` starts the full HTTP server — no external
# servlet container needed.
ENTRYPOINT ["java", "-jar", "app.war"]
