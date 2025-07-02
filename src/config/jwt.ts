import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Centralized JWT configuration
 * This file contains all JWT-related configuration to ensure consistency across the application
 */
export const jwtConfig = {
  /**
   * JWT secret key used for signing and verifying tokens
   * Falls back to a default value if environment variable is not set
   * IMPORTANT: Always set a strong secret in production environment
   */
  secret: process.env.JWT_SECRET as string, // Ensure JWT_SECRET is always set in production
  
  /**
   * JWT token expiration time
   * Falls back to a default value if environment variable is not set
   */
  expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  
  /**
   * Helper function to get the JWT secret
   * This ensures we always use the same secret throughout the application
   */
  getSecret: (): string => jwtConfig.secret,
  
  /**
   * Helper function to get the JWT expiration time
   * This ensures we always use the same expiration time throughout the application
   */
  getExpiresIn: (): string => jwtConfig.expiresIn,

 /**
  * Helper function to get the JWT expiration time in a format suitable for PostgreSQL INTERVAL.
  * Converts '24h' to '24 hours', '7d' to '7 days', etc.
  */
 getExpiresInInterval: (): string => {
   const expiresIn = jwtConfig.expiresIn;
   const value = parseInt(expiresIn.slice(0, -1));
   const unit = expiresIn.slice(-1);

   switch (unit) {
     case 'h':
       return `${value} hours`;
     case 'd':
       return `${value} days`;
     case 'm':
       return `${value} minutes`;
     case 's':
       return `${value} seconds`;
     default:
       return '24 hours'; // Default to 24 hours if format is unknown
   }
 },

 /**
  * Stores the JWT token in localStorage.
  * @param token The JWT token to store.
  */
 setToken: (token: string): void => {
   if (typeof window !== 'undefined') {
     localStorage.setItem('jwtToken', token);
   }
 },

 /**
  * Retrieves the JWT token from localStorage.
  * @returns The JWT token, or null if not found.
  */
 getToken: (): string | null => {
   if (typeof window !== 'undefined') {
     return localStorage.getItem('jwtToken');
   }
   return null;
 },

 /**
  * Removes the JWT token from localStorage.
  */
 removeToken: (): void => {
   if (typeof window !== 'undefined') {
     localStorage.removeItem('jwtToken');
   }
 }
};

export default jwtConfig; 