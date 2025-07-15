import fs from 'fs';
import path from 'path';

// Define the structure of a Service object based on services.json
export interface Service {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  durationMinutes: number;
  category: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

const servicesFilePath = path.join(process.cwd(), 'src/data/services.json');

// Get all services from the local JSON file
export const getAllServices = async (): Promise<Service[]> => {
  try {
    const fileContent = fs.readFileSync(servicesFilePath, 'utf8');
    const services: Service[] = JSON.parse(fileContent);
    return services;
  } catch (error) {
    console.error('Error reading or parsing services.json:', error);
    return []; // Return an empty array or re-throw a custom error
  }
};

// Get a single service by its ID
export const getServiceById = async (id: string | number): Promise<Service | undefined> => {
  const services = await getAllServices();
  const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
  if (isNaN(numericId)) return undefined;
  return services.find((s) => s.id === numericId);
};

// Get all unique service categories
export const getServiceCategories = async (): Promise<string[]> => {
  const services = await getAllServices();
  const categories = services.map(s => s.category);
  return [...new Set(categories)];
};

// Function to generate static paths for service pages
export const getServiceStaticPaths = async () => {
  const services = await getAllServices();
  return services.map(service => ({
    id: service.id.toString(),
  }));
}; 