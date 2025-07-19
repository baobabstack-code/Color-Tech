import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const customersFilePath = path.join(process.cwd(), "src/data/customers.json");

// Helper function to read JSON file
const readJsonFile = (filePath: string) => {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
};

// Helper function to write JSON file
const writeJsonFile = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// GET: Fetch a specific customer
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const customers = readJsonFile(customersFilePath);
    const customer = customers.find((c: any) => c.id === id);

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
    const customers = readJsonFile(customersFilePath);

    const customerIndex = customers.findIndex((c: any) => c.id === id);
    if (customerIndex === -1) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    // Update customer
    customers[customerIndex] = {
      ...customers[customerIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    writeJsonFile(customersFilePath, customers);
    return NextResponse.json(customers[customerIndex]);
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
    const customers = readJsonFile(customersFilePath);

    const customerIndex = customers.findIndex((c: any) => c.id === id);
    if (customerIndex === -1) {
      return NextResponse.json(
        { message: "Customer not found" },
        { status: 404 }
      );
    }

    // Remove customer
    customers.splice(customerIndex, 1);
    writeJsonFile(customersFilePath, customers);

    return NextResponse.json({ message: "Customer deleted successfully" });
  } catch (error) {
    console.error("Failed to delete customer:", error);
    return NextResponse.json(
      { message: "Failed to delete customer" },
      { status: 500 }
    );
  }
}
