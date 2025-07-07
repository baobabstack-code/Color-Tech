/**
 * TypeScript declarations for environment variables
 * This provides type safety and autocompletion for environment variables
 */

declare namespace NodeJS {
  interface ProcessEnv {
    // Strapi Backend Configuration
    STRAPI_ADMIN_URL?: string;
    STRAPI_API_URL?: string;
    
    // Authentication
    JWT_SECRET?: string;
    JWT_EXPIRES_IN?: string;
    
    // Server Configuration
    PORT?: string;
    NODE_ENV?: 'development' | 'production' | 'test';
    
    // Database Configuration
    DB_HOST?: string;
    DB_USER?: string;
    DB_PASSWORD?: string;
    DB_NAME?: string;
    DB_PORT?: string;
    
    // File Upload Configuration
    MAX_FILE_SIZE?: string;
    UPLOAD_DIR?: string;
  }
}