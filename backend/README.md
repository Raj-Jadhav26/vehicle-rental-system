# Cloud-Based Vehicle Rental Management System (Spring Boot Backend)

Designed for 3rd-Year Computer Engineering College Mini-Project.

## Technology Stack
- **Language**: Java 17+
- **Framework**: Spring Boot 3.3.0
- **Modules**: Spring Web, Spring Data JPA, Spring Security, Validation
- **Database**: MySQL 8.0 (Local / AWS RDS)
- **Build Tool**: Apache Maven

---

## Local Development Setup

### Prerequisites
- JDK 17 or higher (`java -version`)
- Maven 3.8+ (`mvn -version`)
- MySQL Server 8.0 running on localhost:3306

### Step 1: Initialize Database
Open MySQL command line or MySQL Workbench:
```sql
CREATE DATABASE vehiclerental_db;
```

### Step 2: Configure Database Credentials
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/vehiclerental_db?createDatabaseIfNotExist=true&useSSL=false
spring.datasource.username=root
spring.datasource.password=root123
```

### Step 3: Build & Run
From the `/backend` folder:
```bash
# Build the JAR
mvn clean install -DskipTests

# Run the Spring Boot application
mvn spring-boot:run
```
The application will launch on `http://localhost:8080/api`.

---

## AWS Deployment Architecture

1. **MySQL on AWS RDS**:
   - Create a `db.t3.micro` MySQL 8.0 instance on AWS RDS Free Tier.
   - Configure Security Group inbound rule to allow Port 3306 from your EC2 instance security group.

2. **Spring Boot on AWS EC2**:
   - Launch Ubuntu 22.04 LTS `t2.micro`.
   - Install Java 17: `sudo apt update && sudo apt install -y openjdk-17-jdk`
   - Upload the executable JAR `target/vehiclerental-backend-1.0.0.jar`.
   - Execute:
     ```bash
     java -jar vehiclerental-backend-1.0.0.jar \
       --spring.datasource.url=jdbc:mysql://<RDS_ENDPOINT>:3306/vehiclerental_db \
       --spring.datasource.username=admin \
       --spring.datasource.password=<RDS_PASSWORD>
     ```

3. **React on AWS S3**:
   - In React root directory: `npm run build`
   - Upload `dist/*` to an S3 bucket configured for Static Website Hosting.
