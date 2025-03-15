import logger from './logger';
import jwtConfig from '../config/jwt';

export interface VerificationResult {
  success: boolean;
  message: string;
}

/**
 * Utility to verify JWT configuration
 * This checks if the JWT secret is properly configured
 */
export const verifyJwtConfig = (): VerificationResult => {
  try {
    // Log JWT configuration (without exposing the secret)
    logger.info('Verifying JWT configuration...');
    
    // Get JWT configuration values
    const secret = jwtConfig.getSecret();
    const expiresIn = jwtConfig.getExpiresIn();
    
    logger.info(`JWT expiration: ${expiresIn}`);
    
    // Check if secret is set and not a default value
    if (!secret) {
      return {
        success: false,
        message: 'JWT secret is not configured. Please set JWT_SECRET in your environment variables.'
      };
    }
    
    if (secret === 'your-secret-key-here' || secret === 'your_secret_key_change_this_in_production') {
      return {
        success: false,
        message: 'JWT secret is using a default value. Please set a strong secret in your environment variables.'
      };
    }
    
    // Check if expiration is set
    if (!expiresIn) {
      return {
        success: false,
        message: 'JWT expiration is not configured. Please set JWT_EXPIRES_IN in your environment variables.'
      };
    }
    
    // Validate expiration format (should be a string like '1h', '1d', etc.)
    const validExpirationFormat = /^(\d+)([smhdwy])$/.test(expiresIn);
    if (!validExpirationFormat && expiresIn !== '24h') {
      return {
        success: false,
        message: `JWT expiration format is invalid: ${expiresIn}. Please use a valid format (e.g., '1h', '1d').`
      };
    }
    
    return {
      success: true,
      message: 'JWT configuration is valid.'
    };
  } catch (error) {
    logger.error('JWT verification error:', error);
    return {
      success: false,
      message: `JWT verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

export default verifyJwtConfig; 