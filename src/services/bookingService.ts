import api from './api';

export interface Booking {
  id: string;
  userId: string;
  vehicleId: string;
  serviceId: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  // Joined fields
  clientName?: string;
  serviceName?: string;
  serviceDescription?: string;
}

export interface CreateBookingData {
  userId: string;
  vehicleId: string;
  serviceId: string;
  scheduledDate: string;
  scheduledTime: string;
  notes?: string;
}

export interface UpdateBookingData {
  scheduledDate?: string;
  scheduledTime?: string;
  status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string;
}

// Admin: Get all bookings
export const getAllBookings = async (): Promise<Booking[]> => {
  if (typeof window === 'undefined') {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'src/data/bookings.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const bookings: Booking[] = JSON.parse(fileContent);
    return bookings;
  } else {
    return [];
  }
};

// Client: Get current user's bookings
export const getMyBookings = async (): Promise<Booking[]> => {
  // For now, just return all bookings
  return getAllBookings();
};

// Get booking by ID
export const getBookingById = async (id: string): Promise<Booking> => {
  const bookings = await getAllBookings();
  const booking = bookings.find((b) => b.id === id);
  return booking as Booking;
};

// Create new booking
export const createBooking = async (data: CreateBookingData): Promise<Booking> => {
  const response = await api.post('/bookings', data);
  return response.data;
};

// Update booking
export const updateBooking = async (id: string, data: UpdateBookingData): Promise<Booking> => {
  const response = await api.put(`/bookings/${id}`, data);
  return response.data;
};

// Cancel booking (client)
export const cancelBooking = async (id: string): Promise<Booking> => {
  return updateBooking(id, { status: 'cancelled' });
};

// Delete booking
export const deleteBooking = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/bookings/${id}`);
  return response.data;
};

// Get booking history (completed bookings)
export const getBookingHistory = async (): Promise<Booking[]> => {
  const response = await api.get('/bookings/history');
  return response.data;
};

// Get bookings by user ID (admin only)
export const getBookingsByUserId = async (userId: string): Promise<Booking[]> => {
  const response = await api.get(`/bookings/user/${userId}`);
  return response.data;
};