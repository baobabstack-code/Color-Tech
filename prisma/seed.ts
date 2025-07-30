import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create sample services
  const services = [
    {
      name: "Panel Beating & Dent Repair",
      description:
        "Professional panel beating services to restore your vehicle's body to its original condition. We handle everything from minor dents to major collision damage.",
      basePrice: 150.0,
      duration: 180, // 3 hours
      category: "Body Repair",
      status: "active" as const,
    },
    {
      name: "Spray Painting & Refinishing",
      description:
        "High-quality automotive spray painting using premium paints and clear coats. Color matching and full vehicle resprays available.",
      basePrice: 300.0,
      duration: 480, // 8 hours
      category: "Paint Services",
      status: "active" as const,
    },
    {
      name: "Rust Treatment & Prevention",
      description:
        "Complete rust removal and treatment services. We stop rust in its tracks and apply protective coatings to prevent future corrosion.",
      basePrice: 120.0,
      duration: 240, // 4 hours
      category: "Rust Treatment",
      status: "active" as const,
    },
    {
      name: "Bumper Repair & Replacement",
      description:
        "Specialized bumper repair services including plastic welding, painting, and complete replacements for all vehicle types.",
      basePrice: 200.0,
      duration: 300, // 5 hours
      category: "Body Repair",
      status: "active" as const,
    },
    {
      name: "Scratch & Scuff Removal",
      description:
        "Professional scratch removal and paint correction services. From light scratches to deep gouges, we restore your paint to perfection.",
      basePrice: 80.0,
      duration: 120, // 2 hours
      category: "Paint Services",
      status: "active" as const,
    },
    {
      name: "Hail Damage Repair",
      description:
        "Specialized hail damage repair using paintless dent removal techniques. Restore your vehicle without affecting the original paint.",
      basePrice: 250.0,
      duration: 360, // 6 hours
      category: "Body Repair",
      status: "active" as const,
    },
  ];

  for (const service of services) {
    await prisma.service.create({
      data: service,
    });
  }

  console.log("✅ Services created");

  // Create a sample admin user (if not exists)
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@colortech.co.zw" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@colortech.co.zw",
      role: "admin",
    },
  });

  console.log("✅ Admin user created");

  // Create sample blog posts
  const blogPosts = [
    {
      title: "The Complete Guide to Panel Beating",
      body: `<p>Panel beating is an essential automotive repair technique that restores damaged vehicle panels to their original condition. Whether you've been in a minor fender bender or experienced more significant collision damage, understanding the panel beating process can help you make informed decisions about your vehicle's repair.</p>

      <h2>What is Panel Beating?</h2>
      <p>Panel beating involves reshaping and repairing damaged metal panels on vehicles. This skilled craft requires specialized tools and techniques to carefully work the metal back into its original form without compromising the structural integrity of the vehicle.</p>

      <h2>Common Panel Beating Techniques</h2>
      <ul>
        <li><strong>Hammer and Dolly Work:</strong> Traditional method using specialized hammers and backing tools</li>
        <li><strong>Paintless Dent Removal:</strong> Modern technique for minor dents without paint damage</li>
        <li><strong>Heat Shrinking:</strong> Used to remove stretched metal areas</li>
        <li><strong>Body Filler Application:</strong> For areas requiring additional material</li>
      </ul>

      <p>At ColorTech Panel Beaters, we combine traditional craftsmanship with modern techniques to deliver exceptional results for every vehicle we service.</p>`,
      imageUrl: "/colortech/4.jpg",
      isPublished: true,
      tags: "panel beating, auto repair, collision repair",
      author: "ColorTech Team",
      slug: "complete-guide-to-panel-beating",
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
    {
      title: "Choosing the Right Paint for Your Vehicle",
      body: `<p>Selecting the perfect paint for your vehicle restoration project is crucial for achieving professional results that last. With various paint types, finishes, and application methods available, making the right choice can seem overwhelming.</p>

      <h2>Types of Automotive Paint</h2>
      <h3>Acrylic Enamel</h3>
      <p>Traditional choice offering good durability and ease of application. Ideal for classic car restorations and budget-conscious projects.</p>

      <h3>Acrylic Urethane</h3>
      <p>Premium option providing superior durability, chemical resistance, and UV protection. Perfect for daily drivers and show cars alike.</p>

      <h3>Water-Based Paint</h3>
      <p>Environmentally friendly option with excellent color matching capabilities and reduced VOC emissions.</p>

      <h2>Color Matching Process</h2>
      <p>Our advanced color matching system ensures perfect color reproduction by analyzing your vehicle's existing paint and accounting for factors like age, fading, and environmental exposure.</p>

      <p>Trust ColorTech Panel Beaters for all your automotive painting needs. We use only premium paints and proven techniques to deliver showroom-quality results.</p>`,
      imageUrl: "/colortech/7.jpg",
      isPublished: true,
      tags: "automotive paint, spray painting, color matching",
      author: "ColorTech Team",
      slug: "choosing-right-paint-for-vehicle",
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
    {
      title: "Preventing and Treating Vehicle Rust",
      body: `<p>Rust is one of the most destructive forces affecting vehicles, especially in humid climates or areas with road salt exposure. Understanding how to prevent and treat rust can significantly extend your vehicle's lifespan and maintain its value.</p>

      <h2>Understanding Rust Formation</h2>
      <p>Rust forms when iron in your vehicle's metal components reacts with oxygen and moisture. This electrochemical process can be accelerated by:</p>
      <ul>
        <li>Road salt and de-icing chemicals</li>
        <li>High humidity environments</li>
        <li>Scratches and paint damage</li>
        <li>Poor drainage areas</li>
      </ul>

      <h2>Prevention Strategies</h2>
      <h3>Regular Washing</h3>
      <p>Frequent washing removes corrosive substances and prevents buildup of rust-promoting materials.</p>

      <h3>Protective Coatings</h3>
      <p>Undercoating and rust-proofing treatments create barriers between metal surfaces and corrosive elements.</p>

      <h3>Prompt Repair</h3>
      <p>Addressing paint chips and scratches immediately prevents moisture from reaching bare metal.</p>

      <h2>Professional Rust Treatment</h2>
      <p>When rust does appear, professional treatment is essential. Our rust removal process includes complete elimination of affected areas, proper surface preparation, and application of protective coatings to prevent recurrence.</p>`,
      imageUrl: "/colortech/20.jpg",
      isPublished: true,
      tags: "rust prevention, rust treatment, vehicle maintenance",
      author: "ColorTech Team",
      slug: "preventing-treating-vehicle-rust",
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
  ];

  for (const post of blogPosts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }

  console.log("✅ Blog posts created");

  // Get existing services for bookings
  const existingServices = await prisma.service.findMany();
  const panelBeatingService = existingServices.find((s) =>
    s.name.includes("Panel Beating")
  );
  const sprayPaintingService = existingServices.find((s) =>
    s.name.includes("Spray Painting")
  );
  const rustTreatmentService = existingServices.find((s) =>
    s.name.includes("Rust Treatment")
  );

  // Create sample bookings only if services exist
  if (panelBeatingService && sprayPaintingService && rustTreatmentService) {
    const sampleBookings = [
      {
        customerId: adminUser.id,
        serviceId: panelBeatingService.id,
        scheduledAt: new Date("2024-03-15T10:00:00Z"),
        status: "confirmed" as const,
        notes: "Rust spots on rear quarter panel",
      },
      {
        customerId: adminUser.id,
        serviceId: sprayPaintingService.id,
        scheduledAt: new Date("2024-03-18T14:30:00Z"),
        status: "pending" as const,
        notes: "Color matching required for front bumper",
      },
      {
        customerId: adminUser.id,
        serviceId: rustTreatmentService.id,
        scheduledAt: new Date("2024-03-12T09:00:00Z"),
        status: "completed" as const,
        notes: "Comprehensive rust treatment completed successfully",
      },
    ];

    for (const booking of sampleBookings) {
      await prisma.booking.create({
        data: booking,
      });
    }
  }

  console.log("✅ Sample bookings created");

  // Create sample FAQs
  const sampleFAQs = [
    {
      question: "How long does a typical panel beating job take?",
      answer:
        "The duration depends on the extent of damage. Minor dents can be fixed in a few hours, while major collision repairs may take several days to a week.",
      category: "Panel Beating",
      status: "published" as const,
      views: 0,
    },
    {
      question: "Do you provide color matching for paint jobs?",
      answer:
        "Yes, we use advanced color matching technology to ensure perfect color reproduction that matches your vehicle's original paint.",
      category: "Paint Services",
      status: "published" as const,
      views: 0,
    },
  ];

  for (const faq of sampleFAQs) {
    await prisma.fAQ.create({
      data: faq,
    });
  }

  console.log("✅ Sample FAQs created");

  // Create sample testimonials with authentic African names
  const sampleTestimonials = [
    {
      name: "Tendai Mukamuri",
      role: "Business Owner",
      image: null,
      quote:
        "Excellent service! My car looks brand new after the panel beating work. The team at Color Tech really knows their craft. Highly recommended!",
      rating: 5,
      status: "approved" as const,
      source: "website",
    },
    {
      name: "Chipo Nyamande",
      role: "Teacher",
      image: null,
      quote:
        "Professional team and great attention to detail. The paint job exceeded my expectations. My Honda looks better than when I first bought it!",
      rating: 5,
      status: "approved" as const,
      source: "google",
    },
    {
      name: "Blessing Moyo",
      role: "Engineer",
      image: null,
      quote:
        "After a minor accident, I was worried about my car's appearance. Color Tech restored it perfectly - you can't even tell there was damage. Excellent workmanship!",
      rating: 5,
      status: "approved" as const,
      source: "website",
    },
    {
      name: "Farai Chitongo",
      role: "Entrepreneur",
      image: null,
      quote:
        "I've used Color Tech twice now for different vehicles. Their rust treatment service saved my old bakkie, and the spray painting on my sedan is flawless. Very reliable!",
      rating: 5,
      status: "approved" as const,
      source: "google",
    },
    {
      name: "Memory Sibanda",
      role: "Nurse",
      image: null,
      quote:
        "The team was so professional and kept me updated throughout the repair process. My car was ready exactly when they promised, and the quality is outstanding.",
      rating: 5,
      status: "approved" as const,
      source: "website",
    },
    {
      name: "Takudzwa Madziva",
      role: "IT Specialist",
      image: null,
      quote:
        "Color Tech's attention to detail is impressive. They fixed hail damage on my car so well that it looks better than before. Fair pricing and excellent service!",
      rating: 5,
      status: "approved" as const,
      source: "google",
    },
  ];

  for (const testimonial of sampleTestimonials) {
    await prisma.testimonial.create({
      data: testimonial,
    });
  }

  console.log("✅ Sample testimonials created");

  // Create gallery items with actual ColorTech images
  const galleryItems = [
    {
      title: "Expert Panel Beating & Bodywork",
      body: "Professional panel beating and precision bodywork showcasing our craftsmanship and technical expertise.",
      imageUrl: "/colortech/4.jpg",
      isPublished: true,
      tags: "panel beating, bodywork, craftsmanship",
      author: "ColorTech Team",
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
    {
      title: "Premium Paint & Color Matching",
      body: "High-quality automotive paint application with advanced color matching technology and smooth finish.",
      imageUrl: "/colortech/7.jpg",
      isPublished: true,
      tags: "paint job, color matching, quality finish",
      author: "ColorTech Team",
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
    {
      title: "Complete Vehicle Restoration",
      body: "Full vehicle transformation showcasing our comprehensive restoration and repair capabilities.",
      imageUrl: "/colortech/21.jpg",
      isPublished: true,
      tags: "restoration, transformation, vehicle repair",
      author: "ColorTech Team",
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
    {
      title: "Professional Workshop Facilities",
      body: "State-of-the-art workshop equipped with modern tools and equipment for precision work.",
      imageUrl: "/colortech/14.jpg",
      isPublished: true,
      tags: "workshop, facilities, modern equipment",
      author: "ColorTech Team",
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
    {
      title: "Collision Repair Excellence",
      body: "Expert collision repair services restoring vehicles to factory specifications.",
      imageUrl: "/colortech/16.jpg",
      isPublished: true,
      tags: "collision repair, factory specs, restoration",
      author: "ColorTech Team",
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
    {
      title: "Surface Preparation & Quality Control",
      body: "Meticulous surface preparation and quality assurance ensuring optimal results.",
      imageUrl: "/colortech/17.jpg",
      isPublished: true,
      tags: "surface preparation, quality control, precision",
      author: "ColorTech Team",
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
    {
      title: "Advanced Repair Techniques",
      body: "Modern repair techniques combined with traditional craftsmanship for superior results.",
      imageUrl: "/colortech/18.jpg",
      isPublished: true,
      tags: "advanced techniques, modern repair, craftsmanship",
      author: "ColorTech Team",
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
    {
      title: "Rust Treatment & Prevention",
      body: "Specialized rust treatment and prevention services to protect your vehicle investment.",
      imageUrl: "/colortech/20.jpg",
      isPublished: true,
      tags: "rust treatment, prevention, vehicle protection",
      author: "ColorTech Team",
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
    {
      title: "Professional Spray Booth",
      body: "Climate-controlled spray booth environment for perfect paint application every time.",
      imageUrl: "/colortech/24.jpg",
      isPublished: true,
      tags: "spray booth, climate control, paint application",
      author: "ColorTech Team",
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
    {
      title: "Skilled Team Collaboration",
      body: "Expert technicians working together to deliver outstanding automotive repair services.",
      imageUrl: "/colortech/27.jpg",
      isPublished: true,
      tags: "team collaboration, skilled technicians, outstanding service",
      author: "ColorTech Team",
      createdBy: adminUser.id,
      updatedBy: adminUser.id,
    },
  ];

  for (const item of galleryItems) {
    await prisma.galleryItem.create({
      data: item,
    });
  }

  console.log("✅ Gallery items created with ColorTech images");

  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
