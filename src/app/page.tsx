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
interface HomePageService {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  category_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_name: string;
}

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
    .map((item: GalleryItem) => {
      return {
        ...item,
        body: typeof item.body === "string" ? item.body : item.title,
      };
    })
    .slice(0, 2);
}

async function getServices() {
  try {
    // Use the service file to fetch services
    const allServices = await getServicesFromApi();
    // Return only the first 3 services
    return allServices.slice(0, 3);
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return [];
  }
}

export default async function HomePage() {
  const [featuredPosts, testimonials, galleryPreviews, services] =
    await Promise.all([
      getFeaturedPosts(),
      getTestimonials(),
      getGalleryPreviews(),
      getServices(),
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
        />
      </main>
    </div>
  );
}
