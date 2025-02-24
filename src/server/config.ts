import dotenv from 'dotenv';

dotenv.config();

export const serverConfig = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:nyashaushe@localhost:5432/color_tech_db',
  jwtSecret: process.env.JWT_SECRET || 'your-super-secret-key-change-this-in-production',
  nodeEnv: process.env.NODE_ENV || 'development'
}; 