import bcrypt from 'bcrypt';
import db from '../utils/db';
import logger from '../utils/logger';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Script to seed an admin user in the database
 * This ensures there's always an admin user available for testing
 */
async function seedAdminUser() {
  try {
    logger.info('Starting admin user seeding...');
    
    // Admin credentials from environment variables or defaults
    const adminEmail = process.env.TEST_ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.TEST_ADMIN_PASSWORD || 'Admin123!';
    const adminFirstName = 'Admin';
    const adminLastName = 'User';
    
    // Check if admin user already exists
    const existingUserResult = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [adminEmail]
    );
    
    if (existingUserResult.rows && existingUserResult.rows.length > 0) {
      logger.info(`Admin user ${adminEmail} already exists. Updating password...`);
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      
      // Update the existing admin user
      await db.query(
        'UPDATE users SET password = $1, is_active = true WHERE email = $2',
        [hashedPassword, adminEmail]
      );
      
      logger.info(`Admin user ${adminEmail} password updated successfully`);
    } else {
      logger.info(`Creating new admin user: ${adminEmail}`);
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      
      // Create users table if it doesn't exist
      await db.query(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          first_name VARCHAR(100),
          last_name VARCHAR(100),
          role VARCHAR(50) NOT NULL DEFAULT 'client',
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);
      
      // Insert the admin user
      await db.query(
        `INSERT INTO users (email, password, first_name, last_name, role, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
        [adminEmail, hashedPassword, adminFirstName, adminLastName, 'admin', true]
      );
      
      logger.info(`Admin user ${adminEmail} created successfully`);
    }
    
    logger.info('✅ Admin user seeding completed successfully!');
    return { success: true };
  } catch (error) {
    logger.error('Error seeding admin user:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  } finally {
    // Close the database connection
    await db.closePool();
  }
}

// Run the seeding if this script is executed directly
if (require.main === module) {
  seedAdminUser()
    .then(result => {
      if (!result.success) {
        process.exit(1);
      }
      process.exit(0);
    })
    .catch(error => {
      logger.error('Unhandled error in admin user seeding:', error);
      process.exit(1);
    });
}

export default seedAdminUser; 