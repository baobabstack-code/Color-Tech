import api from './api';

// Interfaces to match the API response structure
interface Customer {
  id: string;
  name: string;
  email: string;
}

interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export interface Booking {
  id: string;
  customerId: string;
  serviceId: string;
  scheduledAt: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  customer?: Customer; // Enriched data
  service?: Service;   // Enriched data
}

export type CreateBookingData = Omit<Booking, 'id' | 'customer' | 'service'>;
export type UpdateBookingData = Partial<Omit<Booking, 'id' | 'customer' | 'service'>>;

// Get all bookings with enriched customer and service data
export const getAllBookings = async (): Promise<Booking[]> => {
  const response = await api.get('/bookings');
  return response.data;
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