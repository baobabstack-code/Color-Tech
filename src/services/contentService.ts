import api from './api';

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  publishDate: string;
  imageUrl: string;
  readTime: string;
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
  id: string;
  name: string;
  role: string;
  image: string;
  quote: string;
  rating: number;
  status: 'approved' | 'pending' | 'rejected';
  date: string;
  source: 'website' | 'google' | 'facebook';
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  type: 'before-after' | 'showcase';
  beforeImage?: string;
  afterImage?: string;
  image?: string;
  uploadDate: string;
}

export const contentService = {
  // Blog Management
  async getBlogPosts() {
    const response = await api.get<BlogPost[]>('/blog-posts');
    return response.data;
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
    const response = await api.get<GalleryItem[]>('/gallery');
    return response.data;
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
    const response = await api.get<FAQ[]>('/faqs');
    return response.data;
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
    const response = await api.get<Testimonial[]>('/testimonials');
    return response.data;
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