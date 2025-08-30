import api from "./api";
import { DatabaseService } from "@/lib/database";

export interface BlogPost {
  id: number;
  title: string;
  body: string;
  imageUrl: string | null;
  isPublished: boolean;
  tags: string | null;
  author: string;
  slug: string;
  createdBy: number;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  status: "published" | "draft";
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string | null;
  image: string | null;
  quote: string;
  rating: number;
  status: "pending" | "approved" | "rejected";
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryItem {
  id: number;
  title: string;
  body: string | null; // JSON string
  imageUrl: string;
  isPublished: boolean;
  tags: string | null;
  author: string;
  createdBy: number;
  updatedBy: number;
  createdAt: Date;
  updatedAt: Date;
}

export const contentService = {
  // Blog Management
  async getBlogPosts() {
    if (typeof window === "undefined") {
      // Server-side: use database service directly
      try {
        return await DatabaseService.getBlogPosts();
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        return [];
      }
    } else {
      // Client-side: use api service
      const response = await api.get<BlogPost[]>("/content/blog");
      return response.data;
    }
  },

  async createBlogPost(post: Omit<BlogPost, "id">) {
    const response = await api.post<BlogPost>("/content/blog", post);
    return response.data;
  },

  async updateBlogPost(id: string, post: Partial<BlogPost>) {
    const response = await api.put<BlogPost>(`/content/blog/${id}`, post);
    return response.data;
  },

  async deleteBlogPost(id: string) {
    await api.delete(`/content/blog/${id}`);
  },

  // Gallery Management
  async getGalleryItems() {
    if (typeof window === "undefined") {
      // Server-side: use database service directly
      try {
        return await DatabaseService.getGalleryItems();
      } catch (error) {
        console.error("Error fetching gallery items:", error);
        return [];
      }
    } else {
      // Client-side: use api service
      const response = await api.get<GalleryItem[]>("/content/gallery");
      return response.data;
    }
  },

  async uploadGalleryItem(formData: FormData) {
    const response = await api.post<GalleryItem>("/content/media", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async deleteGalleryItem(id: string) {
    await api.delete(`/content/gallery/${id}`);
  },

  // FAQ Management
  async getFAQs() {
    if (typeof window === "undefined") {
      // Server-side: use database service directly
      try {
        return await DatabaseService.getFAQs();
      } catch (error) {
        console.error("Error fetching FAQs:", error);
        return [];
      }
    } else {
      // Client-side: use api service
      const response = await api.get<FAQ[]>("/content/faqs");
      return response.data;
    }
  },

  async getFAQById(id: string) {
    const response = await api.get<FAQ>(`/content/faqs/${id}`);
    return response.data;
  },

  async createFAQ(faq: Omit<FAQ, "id">) {
    const response = await api.post<FAQ>("/content/faqs", faq);
    return response.data;
  },

  async updateFAQ(id: string, faq: Partial<FAQ>) {
    const response = await api.put<FAQ>(`/content/faqs/${id}`, faq);
    return response.data;
  },

  async deleteFAQ(id: string) {
    await api.delete(`/content/faqs/${id}`);
  },

  async incrementFAQViews(id: string) {
    const faq = await this.getFAQById(id);
    return this.updateFAQ(id, { views: faq.views + 1 });
  },

  // Testimonial Management
  async getTestimonials() {
    if (typeof window === "undefined") {
      // Server-side: use database service directly
      try {
        return await DatabaseService.getTestimonials();
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        return [];
      }
    } else {
      // Client-side: use api service
      const response = await api.get<Testimonial[]>("/content/testimonials");
      return response.data;
    }
  },

  async getTestimonialById(id: string) {
    const response = await api.get<Testimonial>(`/content/testimonials/${id}`);
    return response.data;
  },

  async createTestimonial(testimonial: Omit<Testimonial, "id">) {
    const response = await api.post<Testimonial>("/content/testimonials", testimonial);
    return response.data;
  },

  async updateTestimonial(id: string, testimonial: Partial<Testimonial>) {
    const response = await api.put<Testimonial>(
      `/content/testimonials/${id}`,
      testimonial
    );
    return response.data;
  },

  async deleteTestimonial(id: string) {
    await api.delete(`/content/testimonials/${id}`);
  },

  async approveTestimonial(id: string) {
    return this.updateTestimonial(id, { status: "approved" });
  },

  async rejectTestimonial(id: string) {
    return this.updateTestimonial(id, { status: "rejected" });
  },

  // Alias for updateBlogPost to maintain compatibility
  async updatePost(id: string, data: any): Promise<BlogPost> {
    // Map form data to BlogPost format
    const blogPostData = {
      title: data.title,
      body: data.content || data.body,
      imageUrl: data.imageUrl || null,
      isPublished: data.isPublished || false,
      tags: data.tags || null,
      author: data.author || 'Admin',
      slug: data.slug,
      createdBy: 1, // Default user ID
      updatedBy: 1, // Default user ID
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return this.updateBlogPost(id, blogPostData);
  },

  // Alias for createBlogPost to maintain compatibility
  async createPost(data: any): Promise<BlogPost> {
    // Map form data to BlogPost format
    const blogPostData = {
      title: data.title,
      body: data.content || data.body,
      imageUrl: data.imageUrl || null,
      isPublished: data.isPublished || false,
      tags: data.tags || null,
      author: data.author || 'Admin',
      slug: data.slug,
      createdBy: 1, // Default user ID
      updatedBy: 1, // Default user ID
      createdAt: new Date(),
      updatedAt: new Date()
    };
    return this.createBlogPost(blogPostData);
  },
};

export default contentService;

// Export type for better TypeScript support
export type ContentServiceType = typeof contentService;
