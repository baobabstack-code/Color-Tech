import { headers } from "next/headers";
import HomePageClient from "@/components/HomePageClient";
import { getAllServices as getServicesFromApi } from "@/services/serviceService";
import { Service } from "@/services/serviceService";
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

  return (
    <div className="min-h-screen flex flex-col">
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
