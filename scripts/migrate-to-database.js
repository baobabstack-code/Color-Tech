#!/usr/bin/env node

/**
 * Database Migration Script
 * This script helps migrate your application from JSON files to PostgreSQL database
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting database migration process...\n');

// Check if .env file exists
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env file not found!');
  console.log('Please create a .env file with your DATABASE_URL');
  console.log('Example: DATABASE_URL="postgresql://username:password@localhost:5432/colortech_db"');
  process.exit(1);
}

// Read .env file to check for DATABASE_URL
const envContent = fs.readFileSync(envPath, 'utf8');
if (!envContent.includes('DATABASE_URL')) {
  console.error('❌ DATABASE_URL not found in .env file!');
  console.log('Please add your PostgreSQL connection string to .env:');
  console.log('DATABASE_URL="postgresql://username:password@localhost:5432/colortech_db"');
  process.exit(1);
}

try {
  console.log('📦 Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });

  console.log('\n🔧 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  console.log('\n📋 Creating database migration...');
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });

  console.log('\n🌱 Seeding database with existing data...');
  execSync('npx prisma db seed', { stdio: 'inherit' });

  console.log('\n✅ Database migration completed successfully!');
  console.log('\n📊 Your application is now using PostgreSQL instead of JSON files.');
  console.log('\n🎯 Next steps:');
  console.log('1. Start your development server: npm run dev');
  console.log('2. Test your admin panel at http://localhost:3000/admin');
  console.log('3. Verify all data has been migrated correctly');
  console.log('\n💡 You can now safely remove the src/data/*.json files if everything works correctly.');

} catch (error) {
  console.error('\n❌ Migration failed:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Make sure PostgreSQL is running');
  console.log('2. Verify your DATABASE_URL is correct');
  console.log('3. Ensure the database exists');
  console.log('4. Check database permissions');
  process.exit(1);
}