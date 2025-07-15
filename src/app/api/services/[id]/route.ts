import { NextRequest, NextResponse } from 'next/server';
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

// GET: Fetch single service
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const fileContent = fs.readFileSync(servicesFilePath, 'utf8');
    const services: Service[] = JSON.parse(fileContent);
    
    const service = services.find(s => s.id === id);
    if (!service) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }
    
    return NextResponse.json(service);
  } catch (error) {
    console.error('Failed to fetch service:', error);
    return NextResponse.json({ message: 'Failed to fetch service' }, { status: 500 });
  }
}

// PUT: Update service
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();

    // Read existing services
    const fileContent = fs.readFileSync(servicesFilePath, 'utf8');
    const services: Service[] = JSON.parse(fileContent);

    // Find service index
    const serviceIndex = services.findIndex(s => s.id === id);
    if (serviceIndex === -1) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    // Update service
    services[serviceIndex] = {
      ...services[serviceIndex],
      name: data.name || services[serviceIndex].name,
      description: data.description || services[serviceIndex].description,
      basePrice: data.basePrice || services[serviceIndex].basePrice,
      durationMinutes: data.durationMinutes || services[serviceIndex].durationMinutes,
      category: data.category || services[serviceIndex].category,
      status: data.status || services[serviceIndex].status,
      updatedAt: new Date().toISOString()
    };

    // Write back to file
    fs.writeFileSync(servicesFilePath, JSON.stringify(services, null, 2));

    return NextResponse.json(services[serviceIndex]);
  } catch (error) {
    console.error('Failed to update service:', error);
    return NextResponse.json({ message: 'Failed to update service' }, { status: 500 });
  }
}

// DELETE: Delete service
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Read existing services
    const fileContent = fs.readFileSync(servicesFilePath, 'utf8');
    const services: Service[] = JSON.parse(fileContent);

    // Find service index
    const serviceIndex = services.findIndex(s => s.id === id);
    if (serviceIndex === -1) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    // Remove service
    services.splice(serviceIndex, 1);

    // Write back to file
    fs.writeFileSync(servicesFilePath, JSON.stringify(services, null, 2));

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Failed to delete service:', error);
    return NextResponse.json({ message: 'Failed to delete service' }, { status: 500 });
  }
}