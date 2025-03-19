import api from './api';
import { mockVehicles } from '../utils/mockData';

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

// Helper function to get mock vehicles from localStorage
const getMockVehicles = (): Vehicle[] => {
  if (typeof window !== 'undefined') {
    const storedVehicles = localStorage.getItem('mockVehicles');
    return storedVehicles ? JSON.parse(storedVehicles) : mockVehicles;
  }
  return mockVehicles;
};

// Helper function to save mock vehicles to localStorage
const saveMockVehicles = (vehicles: Vehicle[]): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('mockVehicles', JSON.stringify(vehicles));
  }
};

// Get all vehicles (admin only)
export const getAllVehicles = async (): Promise<Vehicle[]> => {
  try {
    const response = await api.get('/vehicles');
    return response.data;
  } catch (error) {
    console.log('Using mock data for getAllVehicles');
    return getMockVehicles();
  }
};

// Get current user's vehicles
export const getMyVehicles = async (): Promise<Vehicle[]> => {
  try {
    const response = await api.get('/vehicles/my-vehicles');
    return response.data;
  } catch (error) {
    console.log('Using mock data for getMyVehicles');
    return getMockVehicles();
  }
};

// Get vehicle by ID
export const getVehicleById = async (id: string): Promise<Vehicle> => {
  try {
    const response = await api.get(`/vehicles/${id}`);
    return response.data;
  } catch (error) {
    console.log('Using mock data for getVehicleById');
    const vehicle = getMockVehicles().find(v => v.id === id);
    if (!vehicle) {
      throw new Error('Vehicle not found');
    }
    return vehicle;
  }
};

// Create new vehicle
export const createVehicle = async (data: CreateVehicleData): Promise<Vehicle> => {
  try {
    const response = await api.post('/vehicles', data);
    return response.data;
  } catch (error) {
    console.log('Using mock data for createVehicle');
    const vehicles = getMockVehicles();
    const newVehicle: Vehicle = {
      id: `mock-${Date.now()}`,
      userId: 'user1',
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedVehicles = [...vehicles, newVehicle];
    saveMockVehicles(updatedVehicles);
    
    return newVehicle;
  }
};

// Update vehicle
export const updateVehicle = async (id: string, data: UpdateVehicleData): Promise<Vehicle> => {
  try {
    const response = await api.put(`/vehicles/${id}`, data);
    return response.data;
  } catch (error) {
    console.log('Using mock data for updateVehicle');
    const vehicles = getMockVehicles();
    const vehicleIndex = vehicles.findIndex(v => v.id === id);
    
    if (vehicleIndex === -1) {
      throw new Error('Vehicle not found');
    }
    
    const updatedVehicle = {
      ...vehicles[vehicleIndex],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    vehicles[vehicleIndex] = updatedVehicle;
    saveMockVehicles(vehicles);
    
    return updatedVehicle;
  }
};

// Delete vehicle
export const deleteVehicle = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await api.delete(`/vehicles/${id}`);
    return response.data;
  } catch (error) {
    console.log('Using mock data for deleteVehicle');
    const vehicles = getMockVehicles();
    const filteredVehicles = vehicles.filter(v => v.id !== id);
    
    if (filteredVehicles.length === vehicles.length) {
      throw new Error('Vehicle not found');
    }
    
    saveMockVehicles(filteredVehicles);
    
    return { message: 'Vehicle deleted successfully' };
  }
}; 