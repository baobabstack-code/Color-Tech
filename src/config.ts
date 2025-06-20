import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configuration object
export const config = {
  // Server configuration
  apiUrl: '/api', // Use relative URL for Next.js fullstack
  
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