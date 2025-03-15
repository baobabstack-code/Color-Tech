import { verifyJwtConfig, VerificationResult } from '../utils/verifyJwtConfig';
import logger from '../utils/logger';

/**
 * Script to verify JWT configuration
 * This can be run to ensure JWT configuration is correct
 */
async function runJwtVerification(): Promise<VerificationResult> {
  try {
    logger.info('Starting JWT configuration verification...');
    
    const result = verifyJwtConfig();
    
    if (result.success) {
      logger.info('✅ JWT configuration is valid!');
      logger.info(result.message);
    } else {
      logger.error('❌ JWT configuration verification failed!');
      logger.error(result.message);
      process.exit(1);
    }
    
    return result;
  } catch (error) {
    logger.error('JWT verification failed with an unexpected error:', error);
    process.exit(1);
    // This return is just to satisfy TypeScript, it will never be reached
    return { success: false, message: 'Verification failed with an error' };
  }
}

// Run the verification if this script is executed directly
if (require.main === module) {
  runJwtVerification()
    .then(() => {
      process.exit(0);
    })
    .catch(error => {
      logger.error('Unhandled error in JWT verification:', error);
      process.exit(1);
    });
}

export default runJwtVerification; 