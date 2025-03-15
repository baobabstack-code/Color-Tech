import { authenticateUserDirect } from '../utils/directAuthUtils';
import testAdminCrud from '../utils/testAdminCrud';
import logger from '../utils/logger';
import dotenv from 'dotenv';
import db from '../utils/db';

// Load environment variables
dotenv.config();

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

/**
 * Script to test admin portal functionality
 * This script:
 * 1. Logs in as an admin user directly against the database
 * 2. Tests CRUD operations using the admin token
 */
async function testAdminPortal() {
  try {
    logger.info('Starting admin portal test...');
    
    // Admin credentials - these should be valid admin credentials
    const adminEmail = process.env.TEST_ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.TEST_ADMIN_PASSWORD || 'Admin123!';
    
    logger.info(`Attempting to login as admin: ${adminEmail}`);
    
    // Login to get admin token using direct authentication
    try {
      const loginResponse = await authenticateUserDirect(adminEmail, adminPassword);
      
      if (!loginResponse || !loginResponse.token) {
        throw new Error('Failed to obtain admin token');
      }
      
      const adminToken = loginResponse.token;
      logger.info('Successfully obtained admin token');
      
      // Test admin CRUD operations
      logger.info('Testing admin CRUD operations...');
      const testResults = await testAdminCrud(API_URL, adminToken);
      
      if (testResults.success) {
        logger.info('✅ Admin portal test completed successfully!');
      } else {
        logger.error('❌ Admin portal test failed!');
        logger.error('See detailed results above for specific failures');
      }
      
      return testResults;
    } catch (error) {
      logger.error('Admin login failed:', error);
      throw new Error(`Admin login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  } catch (error) {
    logger.error('Admin portal test failed:', error);
    return {
      success: false,
      message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error
    };
  } finally {
    // Close the database connection
    await db.closePool();
    logger.info('Database connection closed');
  }
}

// Run the test if this script is executed directly
if (require.main === module) {
  testAdminPortal()
    .then(results => {
      if (!results.success) {
        process.exit(1);
      }
      process.exit(0);
    })
    .catch(error => {
      logger.error('Unhandled error in admin portal test:', error);
      process.exit(1);
    });
}

export default testAdminPortal; 