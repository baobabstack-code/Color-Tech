import { Review as PrismaReview, User, Service, Booking } from '@prisma/client';

// Extended review type with relations
export type Review = PrismaReview & {
  user: User;
  service: Service;
  booking?: Booking | null;
};

export interface CreateReviewData {
  userId: number;
  serviceId: number;
  bookingId?: number;
  rating: number;
  comment?: string;
}

export interface UpdateReviewData {
  rating?: number;
  comment?: string;
  status?: 'pending' | 'published' | 'flagged' | 'archived';
}

// Get all reviews (admin)
export const getAllReviews = async (): Promise<Review[]> => {
  try {
    const response = await fetch('/api/reviews');
    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

// Get published reviews (public)
export const getPublishedReviews = async (): Promise<Review[]> => {
  try {
    const response = await fetch('/api/reviews?status=published');
    if (!response.ok) {
      throw new Error('Failed to fetch published reviews');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching published reviews:', error);
    return [];
  }
};

// Get reviews for current user
export const getMyReviews = async (userId: number): Promise<Review[]> => {
  try {
    const response = await fetch(`/api/reviews/user/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user reviews');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return [];
  }
};

// Get review by ID
export const getReviewById = async (id: number): Promise<Review> => {
  const response = await fetch(`/api/reviews/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch review');
  }
  return response.json();
};

// Create new review
export const createReview = async (data: CreateReviewData): Promise<Review> => {
  const response = await fetch('/api/reviews', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to create review');
  }
  return response.json();
};

// Update review
export const updateReview = async (id: number, data: UpdateReviewData): Promise<Review> => {
  const response = await fetch(`/api/reviews/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error('Failed to update review');
  }
  return response.json();
};

// Delete review
export const deleteReview = async (id: number): Promise<{ message: string }> => {
  const response = await fetch(`/api/reviews/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Failed to delete review');
  }
  return response.json();
};

// Get reviews by user ID (admin only)
export const getReviewsByUserId = async (userId: number): Promise<Review[]> => {
  const response = await fetch(`/api/reviews/user/${userId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch user reviews');
  }
  return response.json();
};