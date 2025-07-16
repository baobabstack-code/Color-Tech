import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

// GET: Fetch single customer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customerId = parseInt(id);
    
    if (isNaN(customerId)) {
      return NextResponse.json({ message: 'Invalid customer ID' }, { status: 400 });
    }

    const customer = await DatabaseService.getUserById(customerId);
    if (!customer || customer.role !== 'customer') {
      return NextResponse.json({ message: 'Customer not found' }, { status: 404 });
    }
    
    return NextResponse.json(customer);
  } catch (error) {
    console.error('Failed to fetch customer:', error);
    return NextResponse.json({ message: 'Failed to fetch customer' }, { status: 500 });
  }
}

// PUT: Update customer
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customerId = parseInt(id);
    
    if (isNaN(customerId)) {
      return NextResponse.json({ message: 'Invalid customer ID' }, { status: 400 });
    }

    const data = await request.json();

    const updatedCustomer = await DatabaseService.updateUser(customerId, {
      ...(data.name && { name: data.name }),
      ...(data.email && { email: data.email }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.address !== undefined && { address: data.address }),
    });

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error('Failed to update customer:', error);
    return NextResponse.json({ message: 'Failed to update customer' }, { status: 500 });
  }
}

// DELETE: Delete customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customerId = parseInt(id);
    
    if (isNaN(customerId)) {
      return NextResponse.json({ message: 'Invalid customer ID' }, { status: 400 });
    }

    await DatabaseService.deleteUser(customerId);
    return NextResponse.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Failed to delete customer:', error);
    return NextResponse.json({ message: 'Failed to delete customer' }, { status: 500 });
  }
}