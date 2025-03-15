# Color-Tech Setup and Deployment Guide

This document provides instructions for setting up the development environment, running the application locally, and deploying it to production.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Development Setup](#development-setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Deployment](#deployment)
  - [Environment Variables](#environment-variables)
  - [Docker Deployment](#docker-deployment)
  - [Manual Deployment](#manual-deployment)
- [Maintenance](#maintenance)

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v16 or later)
- npm (v8 or later)
- MySQL (v8 or later)
- Git

## Development Setup

1. Clone the repository:

```bash
git clone https://github.com/your-organization/color-tech.git
cd color-tech
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=color_tech
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# File Upload Configuration
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880 # 5MB

# Logging Configuration
LOG_LEVEL=debug
LOG_FILE=logs/app.log

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

## Database Setup

1. Create a MySQL database:

```sql
CREATE DATABASE color_tech;
```

2. Run the database schema script:

```bash
mysql -u root -p color_tech < database/schema.sql
```

3. (Optional) Seed the database with sample data:

```bash
npm run seed
```

## Running the Application

1. Start the development server:

```bash
npm run dev
```

This will start the server with hot-reloading enabled.

2. Build for production:

```bash
npm run build
```

3. Start the production server:

```bash
npm start
```

## Testing

1. Run tests:

```bash
npm test
```

2. Run tests with coverage:

```bash
npm run test:coverage
```

3. Run specific tests:

```bash
npm test -- --testPathPattern=BookingController
```

## Deployment

### Environment Variables

Ensure the following environment variables are set in your production environment:

```
PORT=3000
NODE_ENV=production
DB_HOST=your_production_db_host
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
DB_NAME=color_tech
DB_PORT=3306
JWT_SECRET=your_production_jwt_secret
JWT_EXPIRES_IN=24h
UPLOAD_DIR=uploads
MAX_FILE_SIZE=5242880
LOG_LEVEL=info
LOG_FILE=logs/app.log
CORS_ORIGIN=https://your-production-domain.com
```

### Docker Deployment

1. Build the Docker image:

```bash
docker build -t color-tech-api .
```

2. Run the Docker container:

```bash
docker run -p 3000:3000 --env-file .env.production color-tech-api
```

### Manual Deployment

1. Set up a production server with Node.js installed.

2. Clone the repository:

```bash
git clone https://github.com/your-organization/color-tech.git
cd color-tech
```

3. Install production dependencies:

```bash
npm install --production
```

4. Build the application:

```bash
npm run build
```

5. Set up environment variables.

6. Start the application:

```bash
npm start
```

7. (Recommended) Use a process manager like PM2:

```bash
npm install -g pm2
pm2 start dist/server.js --name color-tech-api
```

8. Set up a reverse proxy (Nginx or Apache) to forward requests to the Node.js application.

#### Nginx Configuration Example

```nginx
server {
    listen 80;
    server_name api.color-tech.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

9. Set up SSL with Let's Encrypt:

```bash
sudo certbot --nginx -d api.color-tech.com
```

## Maintenance

### Database Migrations

To run database migrations:

```bash
npm run migrate
```

To create a new migration:

```bash
npm run migrate:create -- migration_name
```

### Logs

Application logs are stored in the `logs` directory. In production, consider using a log aggregation service like ELK Stack or Loggly.

### Backups

Set up regular database backups:

```bash
# Example backup script
mysqldump -u root -p color_tech > backup_$(date +%Y%m%d).sql
```

### Monitoring

Consider setting up monitoring with tools like:

- PM2 for process monitoring
- Prometheus and Grafana for metrics
- Sentry for error tracking

### CI/CD

Set up a CI/CD pipeline using GitHub Actions, GitLab CI, or Jenkins to automate testing and deployment. 