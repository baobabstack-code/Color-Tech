# 🚀 Neon Database Setup Guide for ColorTech

Your new Neon PostgreSQL database has been successfully configured! Here's what was set up and what you need to do next.

## ✅ What's Been Completed

1. **Database Migration**: All 8 existing migrations have been successfully applied to your new Neon database
2. **Database Seeding**: The database has been populated with initial data including:
   - Services
   - Admin user
   - Blog posts
   - Sample bookings
   - FAQs
   - Testimonials
   - Gallery items with ColorTech images
3. **Environment Types**: Updated TypeScript environment variable declarations
4. **Prisma Client**: Generated and ready to use

## 📝 Next Steps - Create Your Environment File

Since `.env` files are gitignored, you need to create one manually:

### 1. Create `.env.local` file in your project root:

```bash
# Copy this content to .env.local in your project root

# Database Configuration (Neon PostgreSQL)
# Recommended for most uses
DATABASE_URL=postgresql://neondb_owner:npg_XYUOlTVg5i0o@ep-wispy-moon-ad7ng2fy-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

# For uses requiring a connection without pgbouncer
DATABASE_URL_UNPOOLED=postgresql://neondb_owner:npg_XYUOlTVg5i0o@ep-wispy-moon-ad7ng2fy.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require

# Parameters for constructing your own connection string
PGHOST=ep-wispy-moon-ad7ng2fy-pooler.c-2.us-east-1.aws.neon.tech
PGHOST_UNPOOLED=ep-wispy-moon-ad7ng2fy.c-2.us-east-1.aws.neon.tech
PGUSER=neondb_owner
PGDATABASE=neondb
PGPASSWORD=npg_XYUOlTVg5i0o

# Parameters for Vercel Postgres Templates
POSTGRES_URL=postgresql://neondb_owner:npg_XYUOlTVg5i0o@ep-wispy-moon-ad7ng2fy-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_URL_NON_POOLING=postgresql://neondb_owner:npg_XYUOlTVg5i0o@ep-wispy-moon-ad7ng2fy.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require
POSTGRES_USER=neondb_owner
POSTGRES_HOST=ep-wispy-moon-ad7ng2fy-pooler.c-2.us-east-1.aws.neon.tech
POSTGRES_PASSWORD=npg_XYUOlTVg5i0o
POSTGRES_DATABASE=neondb
POSTGRES_URL_NO_SSL=postgresql://neondb_owner:npg_XYUOlTVg5i0o@ep-wispy-moon-ad7ng2fy-pooler.c-2.us-east-1.aws.neon.tech/neondb
POSTGRES_PRISMA_URL=postgresql://neondb_owner:npg_XYUOlTVg5i0o@ep-wispy-moon-ad7ng2fy-pooler.c-2.us-east-1.aws.neon.tech/neondb?connect_timeout=15&sslmode=require

# Neon Auth environment variables for Next.js
NEXT_PUBLIC_STACK_PROJECT_ID=43c04ea0-3d11-4102-8165-8869b7694886
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=pck_4y0pdhc8edfgt7kxpnezw8b3r8yyt8yd28br216fevc6r
STACK_SECRET_SERVER_KEY=ssk_dbny4x5fdx149pa6ngvx2m3zv3yakxhag56vtyte8ssrg

# Legacy Database Configuration (for backward compatibility)
DB_HOST=ep-wispy-moon-ad7ng2fy-pooler.c-2.us-east-1.aws.neon.tech
DB_USER=neondb_owner
DB_PASSWORD=npg_XYUOlTVg5i0o
DB_NAME=neondb
DB_PORT=5432

# NextAuth Configuration - UPDATE THESE VALUES!
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-nextauth-secret-change-this-in-production

# JWT Configuration - UPDATE THESE VALUES!
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h

# Google OAuth Configuration - ADD YOUR ACTUAL VALUES!
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Google Maps API Configuration - ADD YOUR ACTUAL VALUE!
NEXT_PUBLIC_MAPS_PLATFORM_API_KEY=your-google-maps-api-key

# Application Configuration
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=./logs/app.log


### 2. Generate Strong Secrets

Replace the placeholder values with actual secrets:

```bash
# Generate a strong NEXTAUTH_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Generate a strong JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 🔧 Database Commands

Here are the key database commands you can use:

```bash
# Generate Prisma client (run after schema changes)
npx prisma generate

# Deploy migrations to database
npx prisma migrate deploy

# Create a new migration (after schema changes)
npx prisma migrate dev --name your_migration_name

# Seed the database with initial data
npm run db:seed

# Open Prisma Studio to view/edit data
npm run db:studio

# Reset database (WARNING: deletes all data)
npm run db:reset
```

## 🚀 Start Your Application

Once you've created your `.env.local` file:

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

## 🔐 Production Deployment

For production deployment (Vercel), add these environment variables to your Vercel project settings:

1. **Required Database Variables:**
   - `DATABASE_URL` (use the pooled connection)
   - `POSTGRES_PRISMA_URL` (for better connection handling)

2. **Required Auth Variables:**
   - `NEXTAUTH_URL` (your production domain)
   - `NEXTAUTH_SECRET` (generated secret)
   - `JWT_SECRET` (generated secret)

3. **Optional OAuth Variables:**
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXT_PUBLIC_MAPS_PLATFORM_API_KEY`

4. **Neon Auth Variables:**
   - `NEXT_PUBLIC_STACK_PROJECT_ID`
   - `NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY`
   - `STACK_SECRET_SERVER_KEY`

## 📊 Database Schema

Your database now contains these tables:
- `users` - User accounts and authentication
- `services` - Service offerings
- `bookings` - Customer bookings
- `reviews` - Customer reviews
- `posts` - Blog posts
- `testimonials` - Customer testimonials
- `faqs` - Frequently asked questions
- `form_submissions` - Contact form submissions
- `gallery_items` - Gallery images and videos
- `videos` - Video content
- `homepage_sections` - Homepage content sections

## 🎯 Admin Access

An admin user has been created with the following credentials:
- **Email**: admin@colortech.co.zw
- **Password**: admin123 (Change this immediately!)

## ⚠️ Security Notes

1. **Change default passwords** immediately
2. **Use strong, unique secrets** for JWT and NextAuth
3. **Never commit** `.env` or `.env.local` files to version control
4. **Regularly rotate** database credentials and API keys
5. **Use environment-specific** configuration for different stages

## 🆘 Troubleshooting

If you encounter issues:

1. **Connection Problems**: Verify your DATABASE_URL is correct
2. **Migration Issues**: Run `npx prisma migrate reset` to start fresh
3. **Client Generation**: Run `npx prisma generate` after schema changes
4. **Environment Variables**: Ensure `.env.local` is in project root

Need help? Check the existing guides:
- `DATABASE_MIGRATION_GUIDE.md`
- `DEPLOYMENT_CHECKLIST.md`
- `SETUP_SECRETS_GUIDE.md`
