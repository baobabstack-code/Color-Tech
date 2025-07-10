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
  if (typeof window === 'undefined') {
    const fs = require('fs');
    const path = require('path');
    const filePath = path.join(process.cwd(), 'src/data/vehicles.json');
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const vehicles: Vehicle[] = JSON.parse(fileContent);
    return vehicles;
  } else {
    return [];
  }
};

// Get current user's vehicles
export const getMyVehicles = async (): Promise<Vehicle[]> => {
  // For now, just return all vehicles
  return getAllVehicles();
};

// Get vehicle by ID
export const getVehicleById = async (id: string): Promise<Vehicle> => {
  const vehicles = await getAllVehicles();
  const vehicle = vehicles.find((v) => v.id === id);
  return vehicle as Vehicle;
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