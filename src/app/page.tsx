import { headers } from 'next/headers';
import HomePageClient from '@/components/HomePageClient';

// Define interfaces for fetched data
interface Service {
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

interface Testimonial {
  id: number;
  user_id: number;
  service_id: number;
  booking_id: number;
  rating: number;
  comment: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_first_name: string;
  user_last_name: string;
  user_email: string;
  service_name: string;
}

interface GalleryItem {
  id: number;
  title: string;
  content_type: string;
  body: string; // JSON string
  image_url: string;
  is_published: boolean;
  tags: string | null;
  author: string | null;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
}

interface BlogPost {
  id: number;
  title: string;
  content_type: string;
  body: string;
  image_url: string | null;
  is_published: boolean;
  tags: string | null;
  author: string | null;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
}

async function getFeaturedPosts() {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const baseUrl = `${protocol}://${host}`;
  const res = await fetch(`${baseUrl}/api/content/blog/featured`, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.featuredPosts || [];
}

async function getTestimonials() {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const baseUrl = `${protocol}://${host}`;
  const res = await fetch(`${baseUrl}/api/reviews?status=approved&limit=3`, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.reviews || [];
}

async function getGalleryPreviews() {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const baseUrl = `${protocol}://${host}`;
  const res = await fetch(`${baseUrl}/api/content?content_type=gallery&is_published=true&limit=2`, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.content || [];
}

async function getServices() {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') || 'http';
  const baseUrl = `${protocol}://${host}`;
  const res = await fetch(`${baseUrl}/api/services?limit=3`, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.services || [];
}

export default async function HomePage() {
  const [featuredPosts, testimonials, galleryPreviews, services] = await Promise.all([
    getFeaturedPosts(),
    getTestimonials(),
    getGalleryPreviews(),
    getServices()
  ]);

  return (
    <HomePageClient
      featuredPosts={featuredPosts}
      testimonials={testimonials}
      galleryPreviews={galleryPreviews}
      services={services}
    />
  );
}
