# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

ColorTech Panel Beaters is a Next.js 15 automotive panel beating and spray painting service application with a PostgreSQL database using Prisma ORM, Cloudinary for media management, and NextAuth for authentication. The project features a comprehensive admin portal for content management.

## Core Architecture

**Framework Stack:**
- **Frontend**: Next.js 15 (App Router) with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth v4 with Prisma adapter
- **Media Storage**: Vercel Blob for image/video uploads
- **Styling**: Tailwind CSS with Radix UI components
- **State Management**: React Query (@tanstack/react-query)

**Database Models (Prisma Schema):**
- User management with roles (admin/staff)
- Service management with categories and bookings
- Gallery items with multiple image types (before/after, single, video)
- Blog posts with rich content and media
- Reviews, testimonials, and FAQ management
- Form submissions and homepage sections

**Key Directory Structure:**
- `src/app/` - Next.js App Router pages and layouts
- `src/components/` - Reusable React components
- `src/lib/` - Utilities, database connections, and shared logic
- `src/services/` - API service layers and business logic
- `prisma/` - Database schema and migrations
- `public/` - Static assets including uploaded media

## Common Development Commands

### Database Operations
```bash
# Generate Prisma client (run after schema changes)
npx prisma generate

# Run database migrations
npm run db:migrate

# Reset database (development only)
npm run db:reset

# Seed database with initial data
npm run db:seed

# Open Prisma Studio (database GUI)
npm run db:studio

# Check database connection and contents
node check-db.js
```

### Development Server
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Testing and Quality
```bash
# Run tests
npm test

# Run linting
npm run lint

# Run database migrations (for CI/CD)
npm run migrate
```

### Docker Development
```bash
# Setup Docker environment
npm run docker:setup

# Build and start containers
npm run docker:up

# Stop containers
npm run docker:down
```

## Architecture Patterns

### Database Access Pattern
All database operations go through the `DatabaseService` class in `src/lib/database.ts`. This provides:
- Centralized database access with Prisma
- Consistent error handling
- Type-safe database operations
- Connection pooling management

### API Route Structure
API routes follow REST conventions:
- `src/app/api/content/[resource]/route.ts` - Content management APIs
- `src/app/api/upload/route.ts` - Media upload via Cloudinary
- Each route handles GET, POST, PUT, DELETE as needed

### Component Organization
- **Pages**: Located in `src/app/[route]/page.tsx`
- **Layouts**: Shared layouts in `src/app/[route]/layout.tsx`
- **Components**: Reusable components in `src/components/`
- **Admin Interface**: Complete admin portal at `src/app/admin/`

### Media Management Architecture
Images and videos are stored in Vercel Blob with these endpoints:
- Upload: `/api/upload` and `/api/content/media`
- Retrieval: Direct Vercel Blob URLs stored in database
- Gallery management integrated with database records
- Files stored with unique filenames in `colortech/` folder

## Environment Configuration

Required environment variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - NextAuth callback URL  
- `NEXTAUTH_SECRET` - NextAuth encryption secret
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob access token

## Common Issues and Solutions

### Database Connection Issues
If gallery management or other database operations fail:
1. Verify `DATABASE_URL` environment variable is set correctly
2. Run `npx prisma generate` to regenerate Prisma client
3. Check database connection with `node check-db.js`
4. Ensure database migrations are up to date with `npm run db:migrate`

### Gallery Upload Problems
Gallery upload issues are typically related to:
1. Vercel Blob token not properly configured (get from https://vercel.com/dashboard/stores)
2. Database user permissions (ensure createdBy/updatedBy fields have valid user IDs)
3. Missing required fields in gallery item creation
4. File size limits (Vercel Blob has size restrictions based on plan)

### Build Issues
- Run `npx prisma generate` before building if database schema changed
- Ensure all environment variables are available in build environment
- Check TypeScript errors with proper type definitions

## Development Workflow

1. **Database Schema Changes**: Update `prisma/schema.prisma`, run `npx prisma generate`, then `npm run db:migrate`
2. **New Features**: Create components in appropriate directories, add API routes if needed, update types
3. **Media Updates**: Use existing upload endpoints, store URLs in database via DatabaseService methods
4. **Content Management**: All content operations go through the admin interface at `/admin`

## Testing

- Jest configuration in `jest.config.js`
- Test files in `src/tests/`
- Database mocking configured for testing environment
- Run tests with `npm test`

## Deployment Notes

- GitHub Actions workflows configured for CI/CD
- Docker support available with multi-stage builds
- Prisma client generation happens automatically via postinstall script
- Environment variables must be configured in production environment

### Vercel Deployment Specific

**Required Environment Variables on Vercel:**
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Full production URL (e.g., https://colortech.co.zw)
- `NEXTAUTH_SECRET` - NextAuth encryption secret
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob access token
- `NODE_ENV=production`

**Next.js Configuration:**
The `next.config.ts` file includes image optimization settings for Vercel Blob.
Ensure the hostname in `remotePatterns` matches your actual Vercel Blob subdomain.

**Build Commands:**
- Build: `npm run build`
- Start: `npm start`
