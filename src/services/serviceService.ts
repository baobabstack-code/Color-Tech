import api from './api';

export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  category_id: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  category_name: string;
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
  if (typeof window === 'undefined') {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'src/data/services.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const services: Service[] = JSON.parse(fileContent);
    return services;
  } else {
    return [];
  }
};

// Get service by ID
export const getServiceById = async (id: number): Promise<Service> => {
  const services = await getAllServices();
  const service = services.find((s) => s.id === Number(id));
  return service as Service;
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