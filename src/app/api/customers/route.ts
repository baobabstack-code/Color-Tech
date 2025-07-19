import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

// GET: Fetch all customers
export async function GET() {
  try {
    const customers = await DatabaseService.getUsers();
    return NextResponse.json(customers);
  } catch (error) {
    console.error("Failed to fetch customers:", error);
    return NextResponse.json(
      { message: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}

// POST: Create a new customer
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.name || !data.email) {
      return NextResponse.json(
        { message: "Missing required fields: name, email" },
        { status: 400 }
      );
    }

    // Create new customer
    const newCustomer = await DatabaseService.createUser({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      address: data.address || null,
      role: "customer",
    });

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error("Failed to create customer:", error);
    return NextResponse.json(
      { message: "Failed to create customer" },
      { status: 500 }
    );
  }
}
