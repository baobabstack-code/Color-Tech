import axios from 'axios';
import logger from './logger';

/**
 * Utility functions for authentication
 */

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
 * Authenticate a user and get a JWT token
 * @param email User email
 * @param password User password
 * @param apiUrl Base API URL
 * @returns Login response with token and user data
 */
export const authenticateUser = async (
  email: string, 
  password: string, 
  apiUrl: string
): Promise<LoginResponse> => {
  try {
    logger.info(`Authenticating user: ${email}`);
    
    const response = await axios.post(`${apiUrl}/auth/login`, {
      email,
      password
    });
    
    if (!response.data || !response.data.token) {
      throw new Error('Authentication failed: No token received');
    }
    
    logger.info('Authentication successful');
    return response.data;
  } catch (error: any) {
    logger.error('Authentication failed:', error.response?.data?.message || error.message);
    throw new Error(`Authentication failed: ${error.response?.data?.message || error.message}`);
  }
};

export default {
  authenticateUser
}; 