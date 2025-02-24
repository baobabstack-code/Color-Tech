export const config = {
  apiUrl: process.env.VITE_API_URL || 'http://localhost:5000/api',
  jwtSecret: process.env.VITE_JWT_SECRET || 'your-secret-key',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:nyashaushe@localhost:5432/color_tech_db',
  // Add other configuration values here
}; 