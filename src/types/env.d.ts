/**
 * TypeScript declarations for environment variables
 * This provides type safety and autocompletion for environment variables
 */

declare namespace NodeJS {
  interface ProcessEnv {
    // Database Configuration (Neon PostgreSQL)
    DATABASE_URL?: string;
    DATABASE_URL_UNPOOLED?: string;

    // Neon Database Parameters
    PGHOST?: string;
    PGHOST_UNPOOLED?: string;
    PGUSER?: string;
    PGDATABASE?: string;
    PGPASSWORD?: string;

    // Vercel Postgres Templates
    POSTGRES_URL?: string;
    POSTGRES_URL_NON_POOLING?: string;
    POSTGRES_USER?: string;
    POSTGRES_HOST?: string;
    POSTGRES_PASSWORD?: string;
    POSTGRES_DATABASE?: string;
    POSTGRES_URL_NO_SSL?: string;
    POSTGRES_PRISMA_URL?: string;

    // Neon Auth Environment Variables
    NEXT_PUBLIC_STACK_PROJECT_ID?: string;
    NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY?: string;
    STACK_SECRET_SERVER_KEY?: string;

    // Legacy Database Configuration (backward compatibility)
    DB_HOST?: string;
    DB_USER?: string;
    DB_PASSWORD?: string;
    DB_NAME?: string;
    DB_PORT?: string;

    // NextAuth Configuration
    NEXTAUTH_URL?: string;
    NEXTAUTH_SECRET?: string;

    // Authentication
    JWT_SECRET?: string;
    JWT_EXPIRES_IN?: string;

    // Google OAuth Configuration
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;

    // Google Maps API Configuration
    NEXT_PUBLIC_MAPS_PLATFORM_API_KEY?: string;

    // Server Configuration
    PORT?: string;
    NODE_ENV?: 'development' | 'production' | 'test';
    NEXT_PUBLIC_API_URL?: string;

    // File Upload Configuration
    MAX_FILE_SIZE?: string;
    UPLOAD_DIR?: string;

    // Logging Configuration
    LOG_LEVEL?: string;
    LOG_FILE?: string;

    // Strapi Backend Configuration
    STRAPI_ADMIN_URL?: string;
    STRAPI_API_URL?: string;
  }
}