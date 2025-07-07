import api from './api';

export interface Review {
  id: string;
  userId: string;
  serviceId: string;
  rating: number;
  comment: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  // Joined fields
  userName?: string;
  serviceName?: string;
}

export interface CreateReviewData {
  serviceId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

// Get all reviews (admin)
export const getAllReviews = async (): Promise<Review[]> => {
  const response = await api.get('/reviews');
  return response.data;
};

// Get reviews for current user
export const getMyReviews = async (): Promise<Review[]> => {
  const response = await api.get('/reviews/my-reviews');
  return response.data;
};

// Get review by ID
export const getReviewById = async (id: string): Promise<Review> => {
  const response = await api.get(`/reviews/${id}`);
  return response.data;
};

// Create new review
export const createReview = async (data: CreateReviewData): Promise<Review> => {
  const response = await api.post('/reviews', data);
  return response.data;
};

// Update review
export const updateReview = async (id: string, data: UpdateReviewData): Promise<Review> => {
  const response = await api.put(`/reviews/${id}`, data);
  return response.data;
};

// Delete review
export const deleteReview = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/reviews/${id}`);
  return response.data;
};

// Get reviews by user ID (admin only)
export const getReviewsByUserId = async (userId: string): Promise<Review[]> => {
  const response = await api.get(`/reviews/user/${userId}`);
  return response.data;
};