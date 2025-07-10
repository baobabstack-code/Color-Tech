import api from './api';

export interface BlogPost {
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

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: 'published' | 'draft';
  lastUpdated: string;
  views: number;
}

export interface Testimonial {
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

export interface GalleryItem {
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

export const contentService = {
  // Blog Management
  async getBlogPosts() {
    if (typeof window === 'undefined') {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'src/data/blog-posts.json');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const blogPosts: BlogPost[] = JSON.parse(fileContent);
      return blogPosts;
    } else {
      return [];
    }
  },

  async createBlogPost(post: Omit<BlogPost, 'id'>) {
    const response = await api.post<BlogPost>('/blog-posts', post);
    return response.data;
  },

  async updateBlogPost(id: string, post: Partial<BlogPost>) {
    const response = await api.put<BlogPost>(`/blog-posts/${id}`, post);
    return response.data;
  },

  async deleteBlogPost(id: string) {
    await api.delete(`/blog-posts/${id}`);
  },

  // Gallery Management
  async getGalleryItems() {
    if (typeof window === 'undefined') {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'src/data/gallery.json');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const galleryItems: GalleryItem[] = JSON.parse(fileContent);
      return galleryItems;
    } else {
      return [];
    }
  },

  async uploadGalleryItem(formData: FormData) {
    const response = await api.post<GalleryItem>('/gallery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async deleteGalleryItem(id: string) {
    await api.delete(`/gallery/${id}`);
  },
  
  // FAQ Management
  async getFAQs() {
    if (typeof window === 'undefined') {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'src/data/faqs.json');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const faqs: FAQ[] = JSON.parse(fileContent);
      return faqs;
    } else {
      return [];
    }
  },

  async getFAQById(id: string) {
    const response = await api.get<FAQ>(`/faqs/${id}`);
    return response.data;
  },

  async createFAQ(faq: Omit<FAQ, 'id'>) {
    const response = await api.post<FAQ>('/faqs', faq);
    return response.data;
  },

  async updateFAQ(id: string, faq: Partial<FAQ>) {
    const response = await api.put<FAQ>(`/faqs/${id}`, faq);
    return response.data;
  },

  async deleteFAQ(id: string) {
    await api.delete(`/faqs/${id}`);
  },

  async incrementFAQViews(id: string) {
    const faq = await this.getFAQById(id);
    return this.updateFAQ(id, { views: faq.views + 1 });
  },
  
  // Testimonial Management
  async getTestimonials() {
    if (typeof window === 'undefined') {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(process.cwd(), 'src/data/testimonials.json');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const testimonials: Testimonial[] = JSON.parse(fileContent);
      return testimonials;
    } else {
      return [];
    }
  },

  async getTestimonialById(id: string) {
    const response = await api.get<Testimonial>(`/testimonials/${id}`);
    return response.data;
  },

  async createTestimonial(testimonial: Omit<Testimonial, 'id'>) {
    const response = await api.post<Testimonial>('/testimonials', testimonial);
    return response.data;
  },

  async updateTestimonial(id: string, testimonial: Partial<Testimonial>) {
    const response = await api.put<Testimonial>(`/testimonials/${id}`, testimonial);
    return response.data;
  },

  async deleteTestimonial(id: string) {
    await api.delete(`/testimonials/${id}`);
  },
  
  async approveTestimonial(id: string) {
    return this.updateTestimonial(id, { status: 'approved' });
  },
  
  async rejectTestimonial(id: string) {
    return this.updateTestimonial(id, { status: 'rejected' });
  }
};