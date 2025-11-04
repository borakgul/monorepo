# 🚀 Monorepo Infrastructure Showcase

**A curated reference setup for local development and containerized deployment with Docker.**

Born from iterative development of a full-stack system (**Spring Boot backend + Vite-React frontend + PostgreSQL**),  
this showcase provides production-style containerization patterns that can easily scale from local testing  
to **Azure Container Registry (ACR)** and **Kubernetes (AKS)** deployments.

> ⚙️ **This is a reference infrastructure**, not a ready SaaS product — copy and adapt what you need for your own stack.

---

## 🧩 What's Inside

**End-to-end containerized setup for:**
- ✅ **PostgreSQL database** with persistent volume  
- ✅ **Spring Boot backend** (Java 21 + Maven multi-stage build)  
- ✅ **React frontend** (Vite + Nginx serving static build)  
- ✅ **Inter-container networking** with Docker bridge  
- ✅ **Cloud-ready Docker images** for later ACR/K8s use  

**Time to integrate into your project:** 20–30 minutes  
**Proven in:** Local dev, staging, and ACR/AKS integration pipelines

---

## ⚡ Quick Start – Local Development

### 1. Create shared Docker network
```bash
docker network create myapp-net || true```
```
### 2. Start PostgreSQL with persistence
```bash
docker rm -f pg || true
docker run -d --name pg \
  --network myapp-net \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=1234 \
  -e POSTGRES_DB=taskdb \
  -p 5432:5432 \
  -v "C:\Users\b00927423\Desktop\Github\pgdata:/var/lib/postgresql/data" \
  postgres:16
```
#### 2.1 Check connectivity 
```bash
docker exec -it pg psql -U postgres -d taskdb -c "\dt"
```
### 3. Build and run the backend container
```bash
docker build -t my-backend:dev ./backend
```
#### and Run
```bash
docker rm -f backend || true
docker run -d --name backend \
  --network myapp-net \
  -p 8080:8080 \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://pg:5432/taskdb \
  -e SPRING_DATASOURCE_USERNAME=postgres \
  -e SPRING_DATASOURCE_PASSWORD=1234 \
  -e SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver \
  -e SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.PostgreSQLDialect \
  -e SPRING_JPA_HIBERNATE_DDL_AUTO=update \
  my-backend:dev
 ```
#### Architecture Overview 
<p align="center">
  <img src="https://raw.githubusercontent.com/borakgul/monorepo/master/public/Architecture-simple.png" 
       alt="System Simple Architecture" 
       width="700">
</p>
<p align="center">

| **Service**   | **Container Port** | **Host Port** | **Notes**                          |
|----------------|-------------------:|---------------:|------------------------------------|
| 🌐 **Frontend** | 80                | 80             | Vite build served by **Nginx**     |
| ⚙️ **Backend**  | 8080              | 8080           | Java **Spring Boot** REST API      |
| 🗄️ **PostgreSQL** | 5432             | 5432           | Database with **persistent volume** |

</p>

### 3. Dockerfile Reference

#### 3.1 backend/Dockerfile
```bash
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /src
COPY pom.xml .
RUN mvn -B -q -DskipTests dependency:go-offline
COPY . .
RUN mvn -B -DskipTests clean package

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /src/target/*.jar /app/app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]
 ```
and
#### 3.2 frontend/Dockerfile

```bash
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist/ /usr/share/nginx/html
# SPA fallback example:
# COPY deploy/docker/nginx.conf /etc/nginx/conf.d/default.conf
 ```
