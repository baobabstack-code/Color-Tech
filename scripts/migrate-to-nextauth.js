const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateToNextAuth() {
    console.log('Starting migration to NextAuth...');

    try {
        // This migration will be handled by Prisma migrate
        // Just run: npm run db:migrate
        console.log('Please run the following commands:');
        console.log('1. npm run db:migrate');
        console.log('2. npm run db:seed (if needed)');

        console.log('Migration preparation complete!');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

migrateToNextAuth();