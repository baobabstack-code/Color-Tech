import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const servicesFilePath = path.join(process.cwd(), 'src/data/services.json');

interface Service {
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

interface ServiceWithStats extends Service {
  bookingCount: number;
  averageRating: number;
  price: number; // Alias for basePrice
  duration: number; // Alias for durationMinutes
  isActive: boolean; // Derived from status
}

// GET: Fetch all services with stats
export async function GET() {
  try {
    const fileContent = fs.readFileSync(servicesFilePath, 'utf8');
    const services: Service[] = JSON.parse(fileContent);

    // Transform services to include stats and aliases
    const servicesWithStats: ServiceWithStats[] = services.map(service => ({
      ...service,
      price: service.basePrice, // Alias for compatibility
      duration: service.durationMinutes, // Alias for compatibility
      isActive: service.status === 'active',
      bookingCount: Math.floor(Math.random() * 50), // Mock data for now
      averageRating: Math.round((Math.random() * 2 + 3) * 10) / 10 // Mock rating between 3-5
    }));

    return NextResponse.json(servicesWithStats);
  } catch (error) {
    console.error('Failed to fetch services with stats:', error);
    return NextResponse.json({ message: 'Failed to fetch services with stats' }, { status: 500 });
  }
}