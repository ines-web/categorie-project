
# Categorie Application

This document provides instructions to set up and run the *Categorie* application using Docker Compose. The application includes the following components:

- PostgreSQL Database
- Backend API
- Frontend Interface
- Keycloak for Identity and Access Management

---

## Start the Application with Docker Compose

Run the command below to start the full application, including all its services:

```bash
docker compose up -d

```
The command will start the following containers:

- PostgreSQL Database 
- Backend API
- Keycloak
- Frontend Interface



## Start the Web Application

- Open the application in your browser at:[http://localhost:4200](http://localhost:4200) as an anonymous user.

- Click on "Connect" if you want to log in.

- You can create a new user by registering or use the following credentials:
    - username : user
    - password : user



## If you want Access the Services
After starting the application, you can access the services as described below:
- **PostgreSQL Database:**
  - Username: `categorie`
  - Port: `5432`
  - Password: `password`

- **Keycloak Access (Realm: "jhipster"):**
  - Username: `admin`
  - Password: `admin`

- **Services:**
  - Backend API (Swagger): [http://localhost:8080/swagger](http://localhost:8080/swagger)
  - Frontend Interface: [http://localhost:4200](http://localhost:4200)

You can access the Swagger API documentation at:

```
http://localhost:8080/swagger-ui/index.html
```


## Package as JAR

To build the final JAR and optimize the *Categorie* application for production, run:

```
./mvnw -Pprod clean verify
```

To verify that the build succeeded, run the following command:

```
java -jar target/*.jar
```


## Package as WAR

To package the application as a WAR for deployment to an application server, run:

```
./mvnw -Pprod,war clean verify
```

## Additional Notes
- Ensure that Docker and Docker Compose are installed on your system before executing the commands.

- For the Keycloak container, everything is all ready created.
- The default configuration uses the username `categorie` and password `password` for PostgreSQL. Update these values in the `application.yml` file or through environment variables if needed for a production setup.



