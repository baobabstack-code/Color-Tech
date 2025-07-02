import api from './api';

export interface Vehicle {
  id: string;
  userId: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vin?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleData {
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vin?: string;
  notes?: string;
}

export interface UpdateVehicleData {
  make?: string;
  model?: string;
  year?: number;
  color?: string;
  licensePlate?: string;
  vin?: string;
  notes?: string;
}

// Get all vehicles (admin only)
export const getAllVehicles = async (): Promise<Vehicle[]> => {
  const response = await api.get('/vehicles');
  return response.data;
};

// Get current user's vehicles
export const getMyVehicles = async (): Promise<Vehicle[]> => {
  const response = await api.get('/vehicles/my-vehicles');
  return response.data;
};

// Get vehicle by ID
export const getVehicleById = async (id: string): Promise<Vehicle> => {
  const response = await api.get(`/vehicles/${id}`);
  return response.data;
};

// Create new vehicle
export const createVehicle = async (data: CreateVehicleData): Promise<Vehicle> => {
  const response = await api.post('/vehicles', data);
  return response.data;
};

// Update vehicle
export const updateVehicle = async (id: string, data: UpdateVehicleData): Promise<Vehicle> => {
  const response = await api.put(`/vehicles/${id}`, data);
  return response.data;
};

// Delete vehicle
export const deleteVehicle = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/vehicles/${id}`);
  return response.data;
};