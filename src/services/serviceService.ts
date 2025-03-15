import api from './api';

export interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  durationMinutes: number;
  category: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceData {
  name: string;
  description: string;
  basePrice: number;
  durationMinutes: number;
  category: string;
}

export interface UpdateServiceData {
  name?: string;
  description?: string;
  basePrice?: number;
  durationMinutes?: number;
  category?: string;
  status?: 'active' | 'inactive';
}

// Get all services
export const getAllServices = async (): Promise<Service[]> => {
  const response = await api.get('/services');
  return response.data;
};

// Get service by ID
export const getServiceById = async (id: string): Promise<Service> => {
  const response = await api.get(`/services/${id}`);
  return response.data;
};

// Create new service (admin only)
export const createService = async (data: CreateServiceData): Promise<Service> => {
  const response = await api.post('/services', data);
  return response.data;
};

// Update service (admin only)
export const updateService = async (id: string, data: UpdateServiceData): Promise<Service> => {
  const response = await api.put(`/services/${id}`, data);
  return response.data;
};

// Delete service (admin only)
export const deleteService = async (id: string): Promise<{ message: string; service?: Service }> => {
  const response = await api.delete(`/services/${id}`);
  return response.data;
}; 