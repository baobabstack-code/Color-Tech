import dotenv from "dotenv";

dotenv.config();

// Database configuration for PostgreSQL
export const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "color_tech_db",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "",
};

// Export for backward compatibility if needed
export default dbConfig;
