import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Fetch all services
export async function GET() {
  try {
    const services = await prisma.service.findMany();
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
    if (!data.name || !data.price || !data.duration) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const newService = await prisma.service.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error('Failed to create service:', error);
    return NextResponse.json({ message: 'Failed to create service' }, { status: 500 });
  }
}
