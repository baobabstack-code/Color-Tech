import { Client } from 'pg';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Database connection config
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'color_tech_db'
};

console.log('Database config:', {
  user: dbConfig.user,
  host: dbConfig.host,
  port: dbConfig.port,
  database: dbConfig.database,
  // Not showing password for security
});

async function checkUsers() {
  const client = new Client(dbConfig);
  
  try {
    console.log('Attempting to connect to database...');
    await client.connect();
    console.log('Connected to database');
    
    // Query users
    console.log('Querying users table...');
    const res = await client.query('SELECT id, email, role, first_name, last_name FROM users');
    
    if (res.rows.length === 0) {
      console.log('No users found in the database.');
    } else {
      console.log(`Found ${res.rows.length} users:`);
      res.rows.forEach(user => {
        console.log(`- ${user.email} (${user.role}): ${user.first_name} ${user.last_name}`);
      });
    }
    
  } catch (error) {
    console.error('Error checking users:', error);
  } finally {
    try {
      await client.end();
      console.log('Disconnected from database');
    } catch (err) {
      console.error('Error disconnecting:', err);
    }
  }
}

checkUsers().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
}); 