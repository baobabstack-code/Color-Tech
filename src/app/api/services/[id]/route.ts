import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Params {
  id: string;
}

// GET: Fetch a single service by ID
export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params;
    const serviceId = Number(id); // Convert id to a number
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Failed to fetch service:', error);
    return NextResponse.json({ message: 'Failed to fetch service' }, { status: 500 });
  }
}

// PUT: Update an existing service
export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params;
    const data = await request.json();

    const updatedService = await prisma.service.update({
      where: { id: Number(id) }, // Convert id to a number
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
        isActive: data.isActive,
      },
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    // Prisma's P2025 error code indicates that the record to update was not found.
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }
    console.error('Failed to update service:', error);
    return NextResponse.json({ message: 'Failed to update service' }, { status: 500 });
  }
}

// DELETE: Remove a service
export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const { id } = params;
    await prisma.service.delete({
      where: { id: Number(id) }, // Convert id to a number
    });

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    // Prisma's P2025 error code indicates that the record to delete was not found.
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2025') {
        return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }
    console.error('Failed to delete service:', error);
    return NextResponse.json({ message: 'Failed to delete service' }, { status: 500 });
  }
}
