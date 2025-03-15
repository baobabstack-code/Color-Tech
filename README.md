# Color-Tech

A vehicle service booking and management application built with Node.js, Express, TypeScript, and PostgreSQL.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- PostgreSQL (v12 or higher)

## Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/color-tech.git
   cd color-tech
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following content (adjust as needed):
   ```
   # Server Configuration
   PORT=3000
   NODE_ENV=development

   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=color_tech_db

   # JWT Configuration
   JWT_SECRET=your_secret_key_change_this_in_production
   JWT_EXPIRES_IN=24h

   # Logging Configuration
   LOG_LEVEL=info
   LOG_FILE=./logs/app.log

   # CORS Configuration
   CORS_ORIGIN=*
   CORS_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE

   # File Upload Configuration
   MAX_FILE_SIZE=5242880
   UPLOAD_DIR=./uploads
   ```

4. Create the PostgreSQL database:
   ```
   npm run db:create
   ```

5. Seed the database with sample data:
   ```
   npm run db:seed
   ```

## Running the Application

### Development Mode

```
npm run dev
```

### Production Mode

```
npm run build
npm start
```

## API Documentation

See the [API_DOCUMENTATION.md](API_DOCUMENTATION.md) file for detailed API documentation.

## Setup and Deployment

See the [SETUP_DEPLOYMENT.md](SETUP_DEPLOYMENT.md) file for detailed setup and deployment instructions.

## Testing

```
npm test
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
