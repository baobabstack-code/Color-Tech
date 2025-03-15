import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Frontend-compatible configuration
export const config = {
  // API configuration
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  
  // JWT configuration
  jwt: {
    secret: import.meta.env.VITE_JWT_SECRET || 'your-secret-key',
    expiresIn: '24h',
  },
  
  // Server configuration (for reference only in frontend)
  server: {
    port: import.meta.env.VITE_PORT || 3000,
    env: import.meta.env.VITE_NODE_ENV || 'development',
  },
  
  // Database configuration (for reference only in frontend)
  db: {
    host: import.meta.env.VITE_DB_HOST || 'localhost',
    user: import.meta.env.VITE_DB_USER || 'postgres',
    password: import.meta.env.VITE_DB_PASSWORD || '',
    database: import.meta.env.VITE_DB_NAME || 'color_tech_db',
    port: 5432,
  },
};

export default config; 