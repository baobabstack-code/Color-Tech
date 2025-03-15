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
  const response = await api.get('/bookings');
  return response.data;
};

// Client: Get current user's bookings
export const getMyBookings = async (): Promise<Booking[]> => {
  const response = await api.get('/bookings/my-bookings');
  return response.data;
};

// Get booking by ID
export const getBookingById = async (id: string): Promise<Booking> => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
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