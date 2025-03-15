# PostgreSQL Setup Guide for Color-Tech

This guide will help you set up PostgreSQL for the Color-Tech application.

## Prerequisites

- PostgreSQL 12 or higher installed on your system
- pgAdmin (optional but recommended for easier database management)

## Setup Steps

### 1. Install PostgreSQL

If you haven't already installed PostgreSQL, download and install it from the [official website](https://www.postgresql.org/download/).

### 2. Configure PostgreSQL

During installation, you'll be prompted to set a password for the default 'postgres' user. Remember this password as you'll need it for the application.

### 3. Update the .env File

In the project root directory, update the `.env` file with your PostgreSQL credentials:

```
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_NAME=color_tech_db
```

Replace `your_postgres_password` with the password you set during PostgreSQL installation.

### 4. Create the Database

You can create the database in two ways:

#### Option 1: Using pgAdmin

1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click on "Databases" and select "Create" > "Database"
4. Enter "color_tech_db" as the database name and click "Save"

#### Option 2: Using the Command Line

1. Open a terminal or command prompt
2. Connect to PostgreSQL:
   ```
   psql -U postgres
   ```
3. Enter your password when prompted
4. Create the database:
   ```
   CREATE DATABASE color_tech_db;
   ```
5. Exit psql:
   ```
   \q
   ```

### 5. Run the Database Setup Scripts

After creating the database, run the following commands from the project root directory:

```
npm run db:create
npm run db:seed
```

The first command will create the tables, and the second will populate them with sample data.

## Troubleshooting

### Connection Issues

If you encounter connection issues:

1. Verify that PostgreSQL is running
2. Check that the credentials in your `.env` file match your PostgreSQL setup
3. Ensure that PostgreSQL is configured to allow connections from your application

### Password Authentication Failed

If you see "password authentication failed for user 'postgres'":

1. Double-check the password in your `.env` file
2. Verify that you can connect to PostgreSQL using the same credentials with psql or pgAdmin

### Port Already in Use

If PostgreSQL's port (default 5432) is already in use:

1. Change the port in PostgreSQL's configuration
2. Update the `DB_PORT` in your `.env` file to match

## Manual Database Setup

If the automatic setup scripts don't work, you can manually set up the database:

1. Create the database as described above
2. Find the schema file at `database/schema.sql`
3. Execute this file against your database:
   ```
   psql -U postgres -d color_tech_db -f database/schema.sql
   ```
4. If you want sample data, you can run:
   ```
   psql -U postgres -d color_tech_db -f database/seed.sql
   ```
   (Note: You may need to create this file by extracting the SQL from the seed.ts file) 