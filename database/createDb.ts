import { Client } from 'pg';
import * as dotenv from 'dotenv';
import { exec } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

// Load environment variables
dotenv.config();

async function createDatabase() {
  const dbName = process.env.DB_NAME || 'color_tech_db';
  const dbUser = process.env.DB_USER || 'postgres';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = parseInt(process.env.DB_PORT || '5432');

  console.log('Database Connection Details:');
  console.log(`DB_HOST: ${dbHost}`);
  console.log(`DB_PORT: ${dbPort}`);
  console.log(`DB_USER: ${dbUser}`);
  console.log(`DB_NAME: ${dbName}`);
  console.log(`DB_PASSWORD: ${dbPassword ? '********' : 'N/A'}`); // Mask password for security

  // Connect to PostgreSQL server (without specifying a database)
  const client = new Client({
    user: dbUser,
    password: dbPassword,
    host: dbHost,
    port: dbPort,
    database: 'postgres' // Connect to default postgres database
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL server');

    // Check if database exists
    const checkDbResult = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName]
    );

    if (checkDbResult.rows.length === 0) {
      // Create database if it doesn't exist
      console.log(`Creating database: ${dbName}`);
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created successfully`);
    } else {
      console.log(`Database ${dbName} already exists`);
    }

    // Close connection to postgres database
    await client.end();

    // Connect to the newly created database
    const dbClient = new Client({
      user: dbUser,
      password: dbPassword,
      host: dbHost,
      port: dbPort,
      database: dbName
    });

    await dbClient.connect();
    console.log(`Connected to database: ${dbName}`);

    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Execute schema
    console.log('Creating tables...');
    await dbClient.query(schema);
    console.log('Tables created successfully');

    await dbClient.end();
    console.log('Database setup completed');
    
    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    return false;
  }
}

// Run the function if this script is executed directly
if (import.meta.url === new URL(import.meta.url).href) {
  createDatabase()
    .then(success => {
      if (success) {
        console.log('Database initialization completed successfully');
        process.exit(0);
      } else {
        console.error('Database initialization failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unhandled error:', error);
      process.exit(1);
    });
}

export default createDatabase;
