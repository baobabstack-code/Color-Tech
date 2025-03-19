import { Client } from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

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

async function createAdminUser() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('Connected to database');
    
    // Hash password
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // First check if the user already exists
    const checkResult = await client.query('SELECT id FROM users WHERE email = $1', ['admin@colortech.com']);
    
    if (checkResult.rows.length > 0) {
      // Update existing admin user
      console.log('Admin user already exists. Updating password...');
      await client.query(`
        UPDATE users 
        SET password = $1, first_name = 'Admin', last_name = 'User', role = 'admin', is_active = true
        WHERE email = $2
      `, [hashedPassword, 'admin@colortech.com']);
      console.log('Admin user updated successfully');
    } else {
      // Create new admin user
      console.log('Creating new admin user...');
      await client.query(`
        INSERT INTO users (email, password, first_name, last_name, role, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      `, ['admin@colortech.com', hashedPassword, 'Admin', 'User', 'admin', true]);
      console.log('Admin user created successfully');
    }
    
    // Verify the admin user
    const verifyResult = await client.query('SELECT id, email, role FROM users WHERE email = $1', ['admin@colortech.com']);
    
    if (verifyResult.rows.length > 0) {
      console.log('Admin user verified:', verifyResult.rows[0]);
      console.log('\nYou can now log in with:');
      console.log('Email: admin@colortech.com');
      console.log('Password: password123');
    } else {
      console.log('Failed to verify admin user');
    }
    
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await client.end();
    console.log('Disconnected from database');
  }
}

createAdminUser().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
}); 