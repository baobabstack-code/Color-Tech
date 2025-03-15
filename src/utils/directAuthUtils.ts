import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from './db';
import logger from './logger';
import jwtConfig from '../config/jwt';

/**
 * Direct authentication utility functions
 * These functions authenticate directly against the database
 * instead of making API calls, which is useful for testing
 */

interface User {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string;
  is_active: boolean;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
  };
}

/**
 * Authenticate a user directly against the database
 * @param email User email
 * @param password User password
 * @returns Login response with token and user data
 */
export const authenticateUserDirect = async (
  email: string, 
  password: string
): Promise<LoginResponse> => {
  try {
    logger.info(`Directly authenticating user: ${email}`);
    
    // Find user by email
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );
    
    if (!result.rows || result.rows.length === 0) {
      throw new Error('Invalid credentials');
    }
    
    const user = result.rows[0] as User;
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    
    // Generate JWT token
    const payload = { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    };
    
    // Get the secret and expiration time
    const secret = jwtConfig.getSecret();
    const expiresIn = jwtConfig.getExpiresIn();
    
    // Sign the token using any to bypass type checking
    // This is a workaround for the type issues with jsonwebtoken
    const token = jwt.sign(payload, secret as any, { expiresIn } as any);
    
    logger.info('Authentication successful');
    
    // Return login response
    return {
      token,
      user: {
        id: user.id.toString(),
        email: user.email,
        role: user.role,
        first_name: user.first_name,
        last_name: user.last_name
      }
    };
  } catch (error: any) {
    logger.error('Authentication failed:', error.message);
    throw new Error(`Authentication failed: ${error.message}`);
  }
};

export default {
  authenticateUserDirect
}; 