import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

// GET: Fetch a specific customer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customer = await DatabaseService.getUserById(parseInt(id));

    if (!customer) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error("Failed to fetch customer:", error);
    return NextResponse.json(
      { message: "Failed to fetch customer" },
      { status: 500 }
    );
  }
}

// PUT: Update a customer
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updatedCustomer = await DatabaseService.updateUser(parseInt(id), {
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
    });

    return NextResponse.json(updatedCustomer);
  } catch (error) {
    console.error("Failed to update customer:", error);
    return NextResponse.json(
      { message: "Failed to update customer" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a customer
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await DatabaseService.deleteUser(parseInt(id));

    return NextResponse.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Failed to delete customer:", error);
    return NextResponse.json(
      { message: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
