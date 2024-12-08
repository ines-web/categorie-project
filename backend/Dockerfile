# Étape 1 : Utiliser une image Maven pour construire le projet
FROM maven:3.9.4-eclipse-temurin-17 as build

WORKDIR /app

# Copier les fichiers de configuration et le code source
COPY pom.xml ./
COPY src ./src
COPY sonar-project.properties ./

# Construire l'application avec Maven
RUN mvn clean package -DskipTests

# Étape 2 : Utiliser une image Java pour exécuter l'application
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copier le JAR généré dans l'image finale
COPY --from=build /app/target/*.jar app.jar

# Exposer le port 8080
EXPOSE 8080

# Démarrer l'application
CMD ["java", "-jar", "app.jar"]
