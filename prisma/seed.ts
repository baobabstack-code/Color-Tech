import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// Helper function to read JSON files
function readJsonFile(filePath: string) {
  try {
    const fullPath = path.join(process.cwd(), filePath);
    const fileContent = fs.readFileSync(fullPath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

async function main() {
  console.log("🌱 Starting database seeding...");

  try {
    // Clear existing data (in reverse order of dependencies)
    console.log("🧹 Clearing existing data...");
    await prisma.review.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.vehicle.deleteMany();
    await prisma.post.deleteMany();
    await prisma.testimonial.deleteMany();
    await prisma.fAQ.deleteMany();
    await prisma.formSubmission.deleteMany();
    await prisma.galleryItem.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.service.deleteMany();
    await prisma.user.deleteMany();

    // Reset sequences
    await prisma.$executeRaw`ALTER SEQUENCE users_id_seq RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE services_id_seq RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE bookings_id_seq RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE reviews_id_seq RESTART WITH 1`;

    // 1. Seed Users (from customers.json)
    console.log("👥 Seeding users...");
    const customers = readJsonFile("src/data/customers.json");
    const users = await Promise.all(
      customers.map(async (customer: any) => {
        return await prisma.user.create({
          data: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            role: "customer",
            createdAt: new Date(customer.createdAt),
            updatedAt: new Date(customer.updatedAt),
          },
        });
      })
    );

    // Add admin user
    const adminUser = await prisma.user.create({
      data: {
        name: "Admin User",
        email: "admin@colortech.com",
        phone: "+1 555 000 0000",
        role: "admin",
        password: "hashed_password_here", // In production, hash this properly
      },
    });

    console.log(`✅ Created ${users.length + 1} users`);

    // 2. Seed Services
    console.log("🔧 Seeding services...");
    const servicesData = readJsonFile("src/data/services.json");
    const services = await Promise.all(
      servicesData.map(async (service: any) => {
        return await prisma.service.create({
          data: {
            name: service.name,
            description: service.description,
            basePrice: service.basePrice,
            duration: service.durationMinutes,
            category: service.category,
            status: service.status === "active" ? "active" : "inactive",
            createdAt: new Date(service.createdAt),
            updatedAt: new Date(service.updatedAt),
          },
        });
      })
    );

    console.log(`✅ Created ${services.length} services`);

    // 3. Seed Bookings
    console.log("📅 Seeding bookings...");
    const bookingsData = readJsonFile("src/data/bookings.json");
    const bookings = await Promise.all(
      bookingsData.map(async (booking: any) => {
        // Map JSON customer IDs to actual database user IDs
        const customerIndex = parseInt(booking.customerId) - 1;
        const serviceIndex = parseInt(booking.serviceId) - 1;

        // Ensure we have valid users and services
        const customerId = users[customerIndex]?.id || users[0]?.id || 1;
        const serviceId = services[serviceIndex]?.id || services[0]?.id || 1;

        return await prisma.booking.create({
          data: {
            customerId: customerId,
            serviceId: serviceId,
            scheduledAt: new Date(booking.scheduledAt),
            status: booking.status,
            notes: booking.notes,
            createdAt: new Date(booking.createdAt),
            updatedAt: new Date(booking.updatedAt),
          },
        });
      })
    );

    console.log(`✅ Created ${bookings.length} bookings`);

    // 4. Seed Reviews
    console.log("⭐ Seeding reviews...");
    const reviewsData = readJsonFile("src/data/reviews.json");
    const reviews = await Promise.all(
      reviewsData.map(async (review: any, index: number) => {
        // Map JSON user IDs to actual database user IDs
        const userIndex = parseInt(review.userId) - 1;
        const serviceIndex = parseInt(review.serviceId) - 1;

        // Ensure we have valid users and services
        const userId = users[userIndex]?.id || users[0]?.id || 1;
        const serviceId = services[serviceIndex]?.id || services[0]?.id || 1;

        return await prisma.review.create({
          data: {
            userId: userId,
            serviceId: serviceId,
            rating: review.rating,
            comment: review.comment,
            status: review.status,
            createdAt: new Date(review.createdAt),
            updatedAt: new Date(review.updatedAt),
          },
        });
      })
    );

    console.log(`✅ Created ${reviews.length} reviews`);

    // 5. Seed Blog Posts
    console.log("📝 Seeding blog posts...");
    const postsData = readJsonFile("src/data/blog-posts.json");
    const posts = await Promise.all(
      postsData.map(async (post: any) => {
        return await prisma.post.create({
          data: {
            title: post.title,
            body: post.body,
            imageUrl: post.image_url,
            isPublished: post.is_published,
            tags: post.tags,
            author: post.author,
            slug: post.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/(^-|-$)/g, ""),
            createdBy: adminUser.id,
            updatedBy: adminUser.id,
            createdAt: new Date(post.created_at),
            updatedAt: new Date(post.updated_at),
          },
        });
      })
    );

    console.log(`✅ Created ${posts.length} blog posts`);

    // 6. Seed Testimonials
    console.log("💬 Seeding testimonials...");
    const testimonialsData = readJsonFile("src/data/testimonials.json");
    const testimonials = await Promise.all(
      testimonialsData.map(async (testimonial: any) => {
        return await prisma.testimonial.create({
          data: {
            name: testimonial.name,
            role: testimonial.role,
            image: testimonial.image,
            quote: testimonial.quote,
            rating: testimonial.rating,
            status: testimonial.status === "approved" ? "approved" : "pending",
            source: testimonial.source,
            createdAt: new Date(testimonial.date),
          },
        });
      })
    );

    console.log(`✅ Created ${testimonials.length} testimonials`);

    // 7. Seed FAQs
    console.log("❓ Seeding FAQs...");
    const faqsData = readJsonFile("src/data/faqs.json");
    const faqs = await Promise.all(
      faqsData.map(async (faq: any) => {
        return await prisma.fAQ.create({
          data: {
            question: faq.question,
            answer: faq.answer,
            category: faq.category,
            status: faq.status,
            views: faq.views,
            createdAt: new Date(faq.lastUpdated),
            updatedAt: new Date(faq.lastUpdated),
          },
        });
      })
    );

    console.log(`✅ Created ${faqs.length} FAQs`);

    // 8. Seed Form Submissions
    console.log("📋 Seeding form submissions...");
    const formSubmissionsData = readJsonFile("src/data/form-submissions.json");
    const formSubmissions = await Promise.all(
      formSubmissionsData.map(async (submission: any) => {
        return await prisma.formSubmission.create({
          data: {
            type: submission.type,
            name: submission.name,
            email: submission.email,
            phone: submission.phone,
            service: submission.service,
            message: submission.message,
            status: submission.status,
            createdAt: new Date(submission.createdAt),
            updatedAt: new Date(submission.updatedAt),
          },
        });
      })
    );

    console.log(`✅ Created ${formSubmissions.length} form submissions`);

    // 9. Seed Gallery Items
    console.log("🖼️ Seeding gallery items...");
    const galleryData = readJsonFile("src/data/gallery.json");
    if (galleryData.length > 0) {
      const galleryItems = await Promise.all(
        galleryData.map(async (item: any) => {
          return await prisma.galleryItem.create({
            data: {
              title: item.title || "Gallery Item",
              body: item.description || "",
              imageUrl:
                item.image || item.beforeImage || "/images/placeholder.jpg",
              isPublished: true,
              tags: item.category || "",
              author: "Admin",
              createdBy: adminUser.id,
              updatedBy: adminUser.id,
              createdAt: new Date(item.uploadDate || new Date()),
              updatedAt: new Date(item.uploadDate || new Date()),
            },
          });
        })
      );
      console.log(`✅ Created ${galleryItems.length} gallery items`);
    } else {
      console.log("ℹ️ No gallery items to seed");
    }

    // 10. Seed Inventory
    console.log("📦 Seeding inventory...");
    const inventoryData = readJsonFile("src/data/inventory.json");
    if (inventoryData.length > 0) {
      const inventoryItems = await Promise.all(
        inventoryData.map(async (item: any) => {
          return await prisma.inventory.create({
            data: {
              name: item.name,
              description: item.description,
              category: item.category,
              quantity: item.quantity,
              minStock: item.minStock || 0,
              price: item.price,
              supplier: item.supplier,
              status: item.status === "in-stock" ? "active" : "active",
              createdAt: new Date(item.createdAt || new Date()),
              updatedAt: new Date(item.updatedAt || new Date()),
            },
          });
        })
      );
      console.log(`✅ Created ${inventoryItems.length} inventory items`);
    } else {
      console.log("ℹ️ No inventory items to seed");
    }

    console.log("🎉 Database seeding completed successfully!");

    // Print summary
    const counts = await Promise.all([
      prisma.user.count(),
      prisma.service.count(),
      prisma.booking.count(),
      prisma.review.count(),
      prisma.post.count(),
      prisma.testimonial.count(),
      prisma.fAQ.count(),
      prisma.formSubmission.count(),
    ]);

    console.log("\n📊 Seeding Summary:");
    console.log(`👥 Users: ${counts[0]}`);
    console.log(`🔧 Services: ${counts[1]}`);
    console.log(`📅 Bookings: ${counts[2]}`);
    console.log(`⭐ Reviews: ${counts[3]}`);
    console.log(`📝 Blog Posts: ${counts[4]}`);
    console.log(`💬 Testimonials: ${counts[5]}`);
    console.log(`❓ FAQs: ${counts[6]}`);
    console.log(`📋 Form Submissions: ${counts[7]}`);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
