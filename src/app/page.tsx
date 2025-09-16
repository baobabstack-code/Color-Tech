import { headers } from "next/headers";
import HomePageClient from "@/components/HomePageClient";
import {
  getAllServices as getServicesFromApi,
  Service,
} from "@/services/serviceService";
import {
  contentService,
  Testimonial,
  GalleryItem,
  BlogPost,
} from "@/services/contentService";

// Define interfaces for fetched data

async function getFeaturedPosts() {
  const blogPosts = await contentService.getBlogPosts();
  return blogPosts.slice(0, 3);
}

async function getTestimonials() {
  const testimonials = await contentService.getTestimonials();
  return testimonials.slice(0, 3);
}

async function getGalleryPreviews() {
  const galleryItems = await contentService.getGalleryItems();
  return galleryItems
    .map((item) => {
      // Create a GalleryItem compatible object from the database item
      return {
        id: item.id,
        title: item.title,
        body: typeof item.body === "string" ? item.body : item.title,
        imageUrl: item.imageUrl,
        isPublished: item.isPublished,
        tags: item.tags,
        author: item.author,
        createdBy: 1, // Default value
        updatedBy: 1, // Default value
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        // Ignore additional properties from the database that aren't in GalleryItem
      };
    })
    .slice(0, 2);
}

async function getHomepageSections() {
  try {
    const { DatabaseService } = await import("@/lib/database");
    const sections = await DatabaseService.getHomepageSections();

    // Convert to a key-value object for easier access
    const sectionsMap = sections.reduce((acc, section) => {
      acc[section.sectionKey] = {
        title: section.title,
        subtitle: section.subtitle,
        description: section.description,
      };
      return acc;
    }, {} as Record<string, any>);

    return sectionsMap;
  } catch (error) {
    console.error("Failed to fetch homepage sections:", error);
    return {};
  }
}

async function getServices() {
  try {
    // Import database service directly for server-side rendering
    const { DatabaseService } = await import("@/lib/database");
    const allServices = await DatabaseService.getServices();
    console.log("Fetched services:", allServices.length, "services"); // Debug log
    // Return only the first 3 services
    return allServices.slice(0, 3);
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}

export default async function HomePage() {
  const [featuredPosts, testimonials, galleryPreviews, services, homepageSections] =
    await Promise.all([
      getFeaturedPosts(),
      getTestimonials(),
      getGalleryPreviews(),
      getServices(),
      getHomepageSections(),
    ]);



  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AutoRepair",
    name: "Color Tech",
    description:
      "Professional auto body repair, spray painting, rust protection, and dent removal services in Harare, Zimbabwe",
    url: "https://color-tech.vercel.app",
    telephone: "+263-XXX-XXXX", // Replace with actual phone
    address: {
      "@type": "PostalAddress",
      streetAddress: "Your Street Address", // Replace with actual address
      addressLocality: "Harare",
      addressRegion: "Harare Province",
      addressCountry: "ZW",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -17.8292, // Harare coordinates
      longitude: 31.0522,
    },
    openingHours: ["Mo-Fr 08:00-17:00", "Sa 08:00-13:00"],
    priceRange: "$$",
    areaServed: {
      "@type": "City",
      name: "Harare",
    },
    serviceType: [
      "Auto Body Repair",
      "Spray Painting",
      "Panel Beating",
      "Dent Removal",
      "Rust Protection",
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="flex-1">
        <HomePageClient
          featuredPosts={featuredPosts as any}
          testimonials={testimonials as any}
          galleryPreviews={galleryPreviews as any}
          services={services as any}
          homepageSections={homepageSections}
        />
      </main>
    </div>
  );
}
