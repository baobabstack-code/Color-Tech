import db from './db';
import logger from './logger';
import bcrypt from 'bcrypt';

/**
 * Utility to test admin CRUD operations directly against the database
 * This can be run manually to verify that admin operations are working correctly
 */
export const testAdminCrud = async (baseUrl: string, adminToken: string) => {
  try {
    logger.info('Starting Admin CRUD operations test (direct database mode)...');
    
    // Test results
    const results = {
      read: { success: false, message: '' },
      create: { success: false, message: '' },
      update: { success: false, message: '' },
      delete: { success: false, message: '' }
    };
    
    // 1. Test READ operation - Get users
    try {
      logger.info('Testing READ operation - Get users');
      const result = await db.query('SELECT * FROM users');
      
      results.read.success = result.rows && result.rows.length >= 0;
      results.read.message = `Successfully retrieved ${result.rows.length} users`;
      logger.info(`READ operation result: ${results.read.success ? 'SUCCESS' : 'FAILED'}`);
    } catch (error: any) {
      results.read.message = `Error: ${error.message}`;
      logger.error(`READ operation failed: ${results.read.message}`);
    }
    
    // 2. Test CREATE operation - Create a test user
    try {
      logger.info('Testing CREATE operation - Create test user');
      
      // Generate a unique email
      const testEmail = `test-${Date.now()}@example.com`;
      const testPassword = 'Test123!';
      const testFirstName = 'Test';
      const testLastName = 'User';
      const testRole = 'client';
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(testPassword, salt);
      
      // Insert the test user
      const createResult = await db.query(
        `INSERT INTO users (email, password, first_name, last_name, role, is_active, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING id`,
        [testEmail, hashedPassword, testFirstName, testLastName, testRole, true]
      );
      
      const userId = createResult.rows[0].id;
      
      results.create.success = !!userId;
      results.create.message = `Successfully created user with ID: ${userId}`;
      logger.info(`CREATE operation result: ${results.create.success ? 'SUCCESS' : 'FAILED'}`);
      
      // If create succeeded, test UPDATE and DELETE
      if (results.create.success && userId) {
        // 3. Test UPDATE operation
        try {
          logger.info(`Testing UPDATE operation - Update user ${userId}`);
          
          const updatedFirstName = 'Updated';
          const updatedLastName = 'TestUser';
          
          const updateResult = await db.query(
            `UPDATE users SET first_name = $1, last_name = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
            [updatedFirstName, updatedLastName, userId]
          );
          
          results.update.success = updateResult.rows && updateResult.rows.length > 0;
          results.update.message = 'Successfully updated user';
          logger.info(`UPDATE operation result: ${results.update.success ? 'SUCCESS' : 'FAILED'}`);
        } catch (error: any) {
          results.update.message = `Error: ${error.message}`;
          logger.error(`UPDATE operation failed: ${results.update.message}`);
        }
        
        // 4. Test DELETE operation
        try {
          logger.info(`Testing DELETE operation - Delete user ${userId}`);
          
          const deleteResult = await db.query(
            'DELETE FROM users WHERE id = $1 RETURNING id',
            [userId]
          );
          
          results.delete.success = deleteResult.rows && deleteResult.rows.length > 0;
          results.delete.message = 'Successfully deleted user';
          logger.info(`DELETE operation result: ${results.delete.success ? 'SUCCESS' : 'FAILED'}`);
        } catch (error: any) {
          results.delete.message = `Error: ${error.message}`;
          logger.error(`DELETE operation failed: ${results.delete.message}`);
        }
      }
    } catch (error: any) {
      results.create.message = `Error: ${error.message}`;
      logger.error(`CREATE operation failed: ${results.create.message}`);
    }
    
    // Summarize results
    const allSuccessful = Object.values(results).every(result => result.success);
    logger.info('Admin CRUD operations test completed');
    logger.info(`Overall result: ${allSuccessful ? 'SUCCESS' : 'FAILED'}`);
    logger.info('Detailed results:');
    Object.entries(results).forEach(([operation, result]) => {
      logger.info(`- ${operation.toUpperCase()}: ${result.success ? 'SUCCESS' : 'FAILED'} - ${result.message}`);
    });
    
    return {
      success: allSuccessful,
      results
    };
  } catch (error) {
    logger.error('Admin CRUD operations test failed:', error);
    return {
      success: false,
      message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      error
    };
  } finally {
    // Don't close the database connection here as it might be needed by other operations
  }
};

export default testAdminCrud; 