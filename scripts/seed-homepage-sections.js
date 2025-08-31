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

async function seedHomepageSections() {
    console.log('Seeding homepage sections...');

    for (const section of defaultSections) {
        try {
            // Check if section already exists
            const existing = await prisma.homepageSection.findUnique({
                where: { sectionKey: section.sectionKey },
            });

            if (existing) {
                console.log(`Section "${section.sectionKey}" already exists, skipping...`);
                continue;
            }

            // Create the section
            await prisma.homepageSection.create({
                data: section,
            });

            console.log(`Created section: ${section.sectionKey}`);
        } catch (error) {
            console.error(`Error creating section ${section.sectionKey}:`, error);
        }
    }

    console.log('Homepage sections seeding completed!');
}

seedHomepageSections()
    .catch((e) => {
        console.error('Error seeding homepage sections:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });