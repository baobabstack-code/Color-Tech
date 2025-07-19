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

// GET: Fetch all customers
export async function GET() {
  try {
    const customers = readJsonFile(customersFilePath);
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

    const customers = readJsonFile(customersFilePath);

    // Generate new ID
    const newId =
      customers.length > 0
        ? Math.max(...customers.map((c: any) => parseInt(c.id))) + 1
        : 1;

    // Create new customer
    const newCustomer = {
      id: newId.toString(),
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      address: data.address || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to customers array
    customers.push(newCustomer);
    writeJsonFile(customersFilePath, customers);

    return NextResponse.json(newCustomer, { status: 201 });
  } catch (error) {
    console.error("Failed to create customer:", error);
    return NextResponse.json(
      { message: "Failed to create customer" },
      { status: 500 }
    );
  }
}
