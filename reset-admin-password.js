const { Client } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Database connection config
const dbConfig = {
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'color_tech_db'
};

async function resetAdminPassword() {
  const client = new Client(dbConfig);
  
  try {
    await client.connect();
    console.log('Connected to database');
    
    // Hash password
    const password = 'password123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Update or insert admin user
    await client.query(`
      INSERT INTO users (email, password, first_name, last_name, role, is_active, created_at, updated_at)
      VALUES ('admin@colortech.com', $1, 'Admin', 'User', 'admin', true, NOW(), NOW())
      ON CONFLICT (email) 
      DO UPDATE SET 
        password = $1,
        first_name = 'Admin',
        last_name = 'User',
        role = 'admin',
        is_active = true,
        updated_at = NOW()
    `, [hashedPassword]);
    
    console.log('Admin user created/updated successfully');
    console.log('\nYou can now log in with:');
    console.log('Email: admin@colortech.com');
    console.log('Password: password123');
    
  } catch (error) {
    console.error('Error updating admin user:', error);
  } finally {
    await client.end();
    console.log('Disconnected from database');
  }
}

resetAdminPassword().catch(err => {
  console.error('Unhandled error:', err);
  process.exit(1);
}); 