import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const defaultSections = [
    {
        sectionKey: 'transformation_gallery',
        title: 'Transformation Gallery',
        subtitle: 'Before & After Showcase',
        description: 'See the dramatic transformations we achieve through our expert repair and restoration work',
        isActive: true,
    },
    {
        sectionKey: 'why_choose_us',
        title: 'Why Choose Us',
        subtitle: 'Excellence in Every Detail',
        description: 'We combine expertise, quality, and customer service to deliver the best auto body repair experience',
        isActive: true,
    },
    {
        sectionKey: 'our_services',
        title: 'Our Services',
        subtitle: 'Professional Auto Body Solutions',
        description: 'Comprehensive auto body repair and painting services',
        isActive: true,
    },
    {
        sectionKey: 'our_process',
        title: 'Our Process',
        subtitle: 'Step-by-Step Excellence',
        description: 'A streamlined and transparent process from start to finish, ensuring your peace of mind',
        isActive: true,
    },
    {
        sectionKey: 'testimonials',
        title: 'What Our Customers Say',
        subtitle: 'Real Stories, Real Results',
        description: 'Real stories from satisfied clients who trust us with their vehicles',
        isActive: true,
    },
    {
        sectionKey: 'blog_section',
        title: 'From Our Blog',
        subtitle: 'Latest News & Tips',
        description: 'Stay updated with the latest news, tips, and insights from our experts',
        isActive: true,
    },
];

async function setupHomepageSections() {
    console.log('Setting up homepage sections...');

    try {
        // Check if the table exists by trying to count records
        const existingCount = await prisma.homepageSection.count();
        console.log(`Found ${existingCount} existing homepage sections`);

        if (existingCount > 0) {
            console.log('Homepage sections already exist, skipping setup');
            return;
        }

        // Create default sections
        for (const section of defaultSections) {
            try {
                await prisma.homepageSection.create({
                    data: section,
                });
                console.log(`Created section: ${section.sectionKey}`);
            } catch (error) {
                console.error(`Error creating section ${section.sectionKey}:`, error);
            }
        }

        console.log('Homepage sections setup completed!');
    } catch (error) {
        if (error.code === 'P2021') {
            console.log('Homepage sections table does not exist yet. This is normal for first deployment.');
            console.log('Please run: npx prisma migrate deploy');
        } else {
            console.error('Error setting up homepage sections:', error);
        }
    }
}

setupHomepageSections()
    .catch((e) => {
        console.error('Error in setup script:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });