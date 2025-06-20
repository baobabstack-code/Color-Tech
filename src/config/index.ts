import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Centralized configuration for Next.js fullstack app
export const config = {
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your_secret_key_change_this_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
  
  // Server configuration
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  
  // Database configuration
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'color_tech_db',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  },
} as const;

export default config;