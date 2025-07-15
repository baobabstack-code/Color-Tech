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

// GET: Fetch all services
export async function GET() {
  try {
    const fileContent = fs.readFileSync(servicesFilePath, 'utf8');
    const services: Service[] = JSON.parse(fileContent);
    return NextResponse.json(services);
  } catch (error) {
    console.error('Failed to fetch services:', error);
    return NextResponse.json({ message: 'Failed to fetch services' }, { status: 500 });
  }
}

// POST: Create a new service
export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.name || !data.basePrice || !data.durationMinutes) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Read existing services
    const fileContent = fs.readFileSync(servicesFilePath, 'utf8');
    const services: Service[] = JSON.parse(fileContent);

    // Create new service
    const newService: Service = {
      id: services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1,
      name: data.name,
      description: data.description || '',
      basePrice: data.basePrice,
      durationMinutes: data.durationMinutes,
      category: data.category || 'General',
      status: data.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to services array
    services.push(newService);

    // Write back to file
    fs.writeFileSync(servicesFilePath, JSON.stringify(services, null, 2));

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('Failed to create service:', error);
    return NextResponse.json({ message: 'Failed to create service' }, { status: 500 });
  }
}
