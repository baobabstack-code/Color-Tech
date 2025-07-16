import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database';

// GET: Fetch all customers (users with customer role)
export async function GET() {
  try {
    const users = await DatabaseService.getUsers();
    // Filter to only return customers
    const customers = users.filter(user => user.role === 'customer');
    return NextResponse.json(customers);
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    return NextResponse.json({ message: 'Failed to fetch customers' }, { status: 500 });
  }
}

// POST: Create a new customer
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.name || !data.email) {
      return NextResponse.json({ message: 'Missing required fields: name, email' }, { status: 400 });
    }

    const newCustomer = await DatabaseService.createUser({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      role: 'customer',
    });

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error('Failed to create customer:', error);
    return NextResponse.json({ message: 'Failed to create customer' }, { status: 500 });
  }
}
