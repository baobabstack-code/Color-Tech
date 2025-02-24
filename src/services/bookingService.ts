import api from './api';

export interface Booking {
  id: string;
  customerName: string;
  service: string;
  vehicleInfo: {
    make: string;
    model: string;
    year: string;
    color: string;
  };
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  notes?: string;
  estimatedDuration: string;
  assignedStaff?: string;
}

export const bookingService = {
  async getBookings() {
    const response = await api.get<Booking[]>('/bookings');
    return response.data;
  },

  async createBooking(booking: Omit<Booking, 'id'>) {
    const response = await api.post<Booking>('/bookings', booking);
    return response.data;
  },

  async updateBooking(id: string, booking: Partial<Booking>) {
    const response = await api.put<Booking>(`/bookings/${id}`, booking);
    return response.data;
  },

  async deleteBooking(id: string) {
    await api.delete(`/bookings/${id}`);
  },

  async confirmBooking(id: string) {
    const response = await api.put<Booking>(`/bookings/${id}/confirm`, {
      status: 'confirmed'
    });
    return response.data;
  }
}; 