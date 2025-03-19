const { Client } = require('pg');
const bcryptjs = require('bcryptjs'); // Using bcryptjs which is what the app uses
require('dotenv').config();

// Database connection config directly from .env
const dbConfig = {
  user: 'postgres',
  password: 'Nyashaushe@2399',
  host: 'localhost',
  port: 5432,
  database: 'color_tech_db'
};

async function createAdmin() {
  console.log("Starting admin user creation...");
  const client = new Client(dbConfig);
  
  try {
    console.log("Connecting to database...");
    await client.connect();
    console.log("Connected to database successfully");
    
    // Hash password - use bcryptjs with 10 rounds as in the app
    const password = 'password123';
    console.log("Hashing password...");
    const hashedPassword = await bcryptjs.hash(password, 10);
    console.log("Password hashed successfully");
    
    // Create or update admin user with simple query
    console.log("Updating/creating admin user...");
    await client.query(`
      INSERT INTO users (email, password, first_name, last_name, role, is_active, created_at, updated_at)
      VALUES ('admin@colortech.com', $1, 'Admin', 'User', 'admin', true, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET 
        password = $1,
        first_name = 'Admin',
        last_name = 'User',
        role = 'admin',
        is_active = true,
        updated_at = NOW()
    `, [hashedPassword]);
    
    console.log("Admin user updated successfully");
    console.log("\nYou can now log in with:");
    console.log("Email: admin@colortech.com");
    console.log("Password: password123");
    
  } catch (error) {
    console.error("Error:", error);
  } finally {
    try {
      await client.end();
      console.log("Disconnected from database");
    } catch (err) {
      console.error("Error disconnecting:", err);
    }
  }
}

// Run the function
createAdmin(); 