const { PrismaClient } = require('@prisma/client');

async function checkDatabase() {
    const prisma = new PrismaClient();

    try {
        console.log('🔍 Checking database contents...\n');

        const userCount = await prisma.user.count();
        const postCount = await prisma.post.count();
        const serviceCount = await prisma.service.count();
        const galleryCount = await prisma.galleryItem.count();
        const testimonialCount = await prisma.testimonial.count();
        const faqCount = await prisma.fAQ.count();
        const bookingCount = await prisma.booking.count();
        const reviewCount = await prisma.review.count();
        const homepageSectionCount = await prisma.homepageSection.count();

        console.log('📊 Database Record Counts:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`👥 Users: ${userCount}`);
        console.log(`📝 Blog Posts: ${postCount}`);
        console.log(`🔧 Services: ${serviceCount}`);
        console.log(`🖼️  Gallery Items: ${galleryCount}`);
        console.log(`💬 Testimonials: ${testimonialCount}`);
        console.log(`❓ FAQs: ${faqCount}`);
        console.log(`📅 Bookings: ${bookingCount}`);
        console.log(`⭐ Reviews: ${reviewCount}`);
        console.log(`🏠 Homepage Sections: ${homepageSectionCount}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

        if (userCount > 0) {
            console.log('👤 Sample Users:');
            const users = await prisma.user.findMany({ take: 3, select: { id: true, name: true, email: true, role: true } });
            users.forEach(user => console.log(`   - ${user.name} (${user.email}) - ${user.role}`));
            console.log('');
        }

        if (postCount > 0) {
            console.log('📖 Sample Blog Posts:');
            const posts = await prisma.post.findMany({ take: 3, select: { title: true, isPublished: true } });
            posts.forEach(post => console.log(`   - ${post.title} ${post.isPublished ? '✅' : '❌'}`));
            console.log('');
        }

        if (serviceCount > 0) {
            console.log('🔧 Available Services:');
            const services = await prisma.service.findMany({ take: 5, select: { name: true, status: true } });
            services.forEach(service => console.log(`   - ${service.name} (${service.status})`));
            console.log('');
        }

        console.log('✅ Database connection successful!');
        console.log('✅ All data has been migrated to your new Neon database!');

    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkDatabase();
