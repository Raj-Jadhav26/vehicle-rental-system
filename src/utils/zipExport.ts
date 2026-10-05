import JSZip from 'jszip';

export async function generateProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // 1. VS Code Instructions File
  zip.file('VSCODE_SETUP_GUIDE.md', `# Step-by-Step Guide: Running in VS Code

## 1. Prerequisites to Install on Your Computer
- **VS Code**: [Download VS Code](https://code.visualstudio.com/)
- **Java Development Kit (JDK 17 or 21)**: e.g. Amazon Corretto, Eclipse Temurin, or Oracle JDK
- **Apache Maven**: (Optional if using IDE or mvn wrapper)
- **Node.js (v18 or v20)**: [Download Node.js](https://nodejs.org/)
- **MySQL Community Server**: [Download MySQL](https://dev.mysql.com/downloads/mysql/) or XAMPP

## 2. Recommended VS Code Extensions
In VS Code, press \`Ctrl+Shift+X\` and install:
1. **Extension Pack for Java** (by Microsoft)
2. **Spring Boot Extension Pack** (by VMware)
3. **Tailwind CSS IntelliSense**

---

## 3. Step-by-Step Execution

### Step A: Initialize the MySQL Database
1. Open MySQL Command Line or MySQL Workbench / phpMyAdmin.
2. Run the SQL commands in \`backend/src/main/resources/schema.sql\` and \`backend/src/main/resources/data.sql\`:
\`\`\`sql
CREATE DATABASE vehiclerental_db;
\`\`\`
3. Verify password in \`backend/src/main/resources/application.properties\`:
\`\`\`properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
\`\`\`

---

### Step B: Run Spring Boot Backend
1. Open a new Terminal in VS Code (\`Ctrl+\` \` or Terminal -> New Terminal).
2. Change into the backend directory:
\`\`\`bash
cd backend
\`\`\`
3. Compile and launch Spring Boot:
\`\`\`bash
mvn clean install -DskipTests
mvn spring-boot:run
\`\`\`
The backend will run at \`http://localhost:8080/api\`.

---

### Step C: Run React Frontend
1. Open a second Terminal in VS Code (\`+\` button in terminal panel).
2. Install frontend dependencies:
\`\`\`bash
npm install
\`\`\`
3. Start the Vite React development server:
\`\`\`bash
npm run dev
\`\`\`
4. Open the displayed local URL: \`http://localhost:3000\` (or \`http://localhost:5173\`).

You now have the full stack running on your machine in VS Code!
`);

  // 2. Add backend files
  const backendFolder = zip.folder('backend');
  if (backendFolder) {
    backendFolder.file('pom.xml', `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.0</version>
        <relativePath/>
    </parent>
    <groupId>com.example</groupId>
    <artifactId>vehiclerental-backend</artifactId>
    <version>1.0.0</version>
    <name>Vehicle Rental Management System</name>
    <description>Cloud-Based Vehicle Rental System for College Mini-Project</description>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`);

    const resFolder = backendFolder.folder('src/main/resources');
    if (resFolder) {
      resFolder.file('application.properties', `server.port=8080
server.servlet.context-path=/api

spring.datasource.url=jdbc:mysql://localhost:3306/vehiclerental_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root123
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
`);
      resFolder.file('schema.sql', `-- Database Schema
CREATE DATABASE IF NOT EXISTS vehiclerental_db;
USE vehiclerental_db;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vehicles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vehicle_name VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL,
    model VARCHAR(50) NOT NULL,
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    price_per_day DECIMAL(10,2) NOT NULL,
    image_url TEXT NOT NULL,
    availability BOOLEAN DEFAULT TRUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    vehicle_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    booking_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_vehicle FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE CASCADE
);`);
      resFolder.file('data.sql', `USE vehiclerental_db;

INSERT INTO users (id, name, email, password, phone, role) VALUES
(1, 'Admin System', 'admin@vehiclerental.com', '$2a$10$w0u3hE8t7qZkWzM7vQ7Nye0l5M3zC9bYjK1pQ5h9c3L1jK9pQ5h9c', '9876543210', 'ADMIN'),
(2, 'Rahul Sharma', 'user@vehiclerental.com', '$2a$10$w0u3hE8t7qZkWzM7vQ7Nye0l5M3zC9bYjK1pQ5h9c3L1jK9pQ5h9c', '9123456789', 'USER')
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO vehicles (id, vehicle_name, brand, type, model, registration_number, price_per_day, image_url, availability, description) VALUES
(1, 'Honda City', 'Honda', 'CAR', '2023 ZX', 'MH-12-AB-1234', 2200.00, 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=900&q=80', TRUE, 'Premium sedan with sunroof and automatic transmission.'),
(2, 'Toyota Innova Crysta', 'Toyota', 'CAR', '2022 2.4 VX', 'MH-14-CD-5678', 3500.00, 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=900&q=80', TRUE, 'Spacious 7-seater MPV for family trips.'),
(3, 'Hyundai Creta', 'Hyundai', 'CAR', '2023 SX', 'DL-01-EF-9012', 2800.00, 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=900&q=80', TRUE, 'Compact SUV with high ground clearance.'),
(4, 'Royal Enfield Classic 350', 'Royal Enfield', 'BIKE', '2023 Reborn', 'KA-05-GH-3456', 1200.00, 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=900&q=80', TRUE, 'Classic retro cruiser motorcycle.'),
(5, 'Honda Activa 6G', 'Honda', 'SCOOTER', '2023 Deluxe', 'MH-02-IJ-7890', 500.00, 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=900&q=80', TRUE, 'Easy city automatic scooter.')
ON DUPLICATE KEY UPDATE id=id;`);
    }

    const javaFolder = backendFolder.folder('src/main/java/com/example/vehiclerental');
    if (javaFolder) {
      javaFolder.file('VehicleRentalApplication.java', `package com.example.vehiclerental;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class VehicleRentalApplication {
    public static void main(String[] args) {
        SpringApplication.run(VehicleRentalApplication.class, args);
        System.out.println("Spring Boot Vehicle Rental Backend running on port 8080!");
    }
}`);
    }
  }

  // 3. Add package.json
  zip.file('package.json', JSON.stringify({
    name: "cloud-vehicle-rental-system",
    private: true,
    version: "1.0.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "tsc && vite build",
      preview: "vite preview"
    },
    dependencies: {
      "axios": "^1.7.9",
      "lucide-react": "^0.546.0",
      "react": "^19.0.1",
      "react-dom": "^19.0.1"
    },
    devDependencies: {
      "@tailwindcss/vite": "^4.3.3",
      "@types/node": "^22.14.0",
      "@types/react": "^19.3.0",
      "@types/react-dom": "^19.3.0",
      "@vitejs/plugin-react": "^6.1.1",
      "tailwindcss": "^4.3.3",
      "typescript": "^7.0.2",
      "vite": "^8.3.0"
    }
  }, null, 2));

  return await zip.generateAsync({ type: 'blob' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
