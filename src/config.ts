import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration object
export const config = {
  // Server configuration
  apiUrl: process.env.NEXT_PUBLIC_API_URL || '/api', // Use environment variable for API URL

  // File upload configuration
  uploads: {
    maxSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB in bytes
    directory: process.env.UPLOAD_DIR || './uploads',
  },

  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/app.log',
  },
};

export default config;