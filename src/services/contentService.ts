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
  }
}; 