# 🚀 Database Migration Guide

This guide will help you migrate your Color-Tech auto body shop application from JSON files to a robust PostgreSQL database.

## 📋 Prerequisites

Before starting the migration, ensure you have:

1. **PostgreSQL installed and running**
   - Download from: https://www.postgresql.org/download/
   - Or use Docker: `docker run --name postgres -e POSTGRES_PASSWORD=yourpassword -p 5432:5432 -d postgres`

2. **Node.js and npm/pnpm installed**
   - Node.js 18+ recommended

3. **Your existing JSON data files** (they will be migrated automatically)

## 🔧 Step 1: Database Setup

### Create a PostgreSQL Database

```sql
-- Connect to PostgreSQL as superuser
CREATE DATABASE colortech_db;
CREATE USER colortech_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE colortech_db TO colortech_user;
```

### Configure Environment Variables

Create or update your `.env` file in the project root:

```env
# Database Configuration
DATABASE_URL="postgresql://colortech_user:your_secure_password@localhost:5432/colortech_db"

# Next.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key"

# Optional: Other environment variables
NODE_ENV="development"
```

## 🚀 Step 2: Run the Migration

We've created an automated migration script that will:

- Install dependencies
- Generate Prisma client
- Create database tables
- Migrate all your JSON data to PostgreSQL

Run the migration:

```bash
npm run migrate
```

Or manually step by step:

```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Create database migration
npx prisma migrate dev --name init

# Seed database with existing JSON data
npx prisma db seed
```

## 📊 Step 3: Verify Migration

After migration, verify everything works:

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Test the admin panel:**
   - Visit: http://localhost:3000/admin/dashboard
   - Check reviews: http://localhost:3000/admin/reviews
   - Verify bookings: http://localhost:3000/admin/bookings

3. **Check database with Prisma Studio:**
   ```bash
   npm run db:studio
   ```

## 🗃️ What Gets Migrated

The migration will transfer all your data from JSON files to database tables:

### Data Migration Mapping

| JSON File               | Database Table     | Notes                                       |
| ----------------------- | ------------------ | ------------------------------------------- |
| `customers.json`        | `users`            | Customers become users with role='customer' |
| `services.json`         | `services`         | Direct mapping with enhanced fields         |
| `bookings.json`         | `bookings`         | With proper foreign key relationships       |
| `reviews.json`          | `reviews`          | Linked to users and services                |
| `blog-posts.json`       | `posts`            | Blog content with author relationships      |
| `testimonials.json`     | `testimonials`     | Customer testimonials                       |
| `faqs.json`             | `faqs`             | FAQ content                                 |
| `form-submissions.json` | `form_submissions` | Contact form data                           |
| `gallery.json`          | `gallery_items`    | Gallery images and content                  |

### New Database Features

✅ **Proper Relationships**: Foreign keys between users, services, bookings, and reviews
✅ **Data Integrity**: Database constraints and validation
✅ **Performance**: Indexed queries for faster searches
✅ **Scalability**: Handle thousands of records efficiently
✅ **Backup & Recovery**: Standard PostgreSQL backup tools
✅ **Concurrent Access**: Multiple users can access safely

## 🔄 API Changes

All your existing API endpoints now use the database instead of JSON files:

- `/api/reviews` - Now queries the database with proper joins
- `/api/services` - Enhanced with relationship data
- `/api/bookings` - Includes customer and service details
- `/api/customers` - Now part of the users table
- `/api/dashboard` - Real-time statistics from database

## 🛠️ Database Management Commands

```bash
# View database in browser
npm run db:studio

# Create a new migration
npm run db:migrate

# Reset database (WARNING: Deletes all data)
npm run db:reset

# Re-seed database
npm run db:seed
```

## 🔍 Troubleshooting

### Common Issues

**1. Connection Error**

```
Error: Can't reach database server
```

**Solution**: Ensure PostgreSQL is running and DATABASE_URL is correct.

**2. Permission Denied**

```
Error: permission denied for database
```

**Solution**: Grant proper permissions to your database user.

**3. Migration Fails**

```
Error: Table already exists
```

**Solution**: Reset the database: `npm run db:reset`

**4. Seed Data Issues**

```
Error: Foreign key constraint fails
```

**Solution**: Check that your JSON data has valid relationships.

### Getting Help

If you encounter issues:

1. Check the console output for specific error messages
2. Verify your DATABASE_URL is correct
3. Ensure PostgreSQL is running
4. Check that all JSON files are valid
5. Try resetting the database: `npm run db:reset`

## 📈 Performance Benefits

After migration, you'll experience:

- **Faster Queries**: Database indexes speed up searches
- **Better Reliability**: ACID transactions ensure data consistency
- **Scalability**: Handle thousands of customers and bookings
- **Real-time Stats**: Dashboard updates reflect live data
- **Concurrent Users**: Multiple admins can work simultaneously

## 🗂️ Backup Strategy

### Automated Backups

Set up regular PostgreSQL backups:

```bash
# Create backup
pg_dump colortech_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql colortech_db < backup_20241216_143022.sql
```

### Development Backup

```bash
# Export current data
npx prisma db seed

# This creates a snapshot of your current database state
```

## 🎯 Next Steps

After successful migration:

1. **Remove JSON files** (optional, keep as backup initially):

   ```bash
   # Move to backup folder
   mkdir data_backup
   mv src/data/*.json data_backup/
   ```

2. **Set up production database** for deployment

3. **Configure automated backups** for production

4. **Monitor performance** and optimize queries as needed

## 🚨 Important Notes

- **Backup First**: Always backup your JSON files before migration
- **Test Thoroughly**: Verify all functionality works after migration
- **Production Ready**: This setup is suitable for production use
- **Reversible**: You can always restore from JSON backups if needed

## 🎉 Success!

Once migration is complete, your Color-Tech application will be running on a professional-grade database system, ready to scale with your business growth!

---

**Need help?** Check the troubleshooting section above or review the console output for specific error messages.
