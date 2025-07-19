import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const servicesFilePath = path.join(process.cwd(), "src/data/services.json");

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

// GET: Fetch a specific service
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const services = readJsonFile(servicesFilePath);
    const service = services.find(
      (s: any) => s.id === parseInt(id) || s.id === id
    );

    if (!service) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error("Failed to fetch service:", error);
    return NextResponse.json(
      { message: "Failed to fetch service" },
      { status: 500 }
    );
  }
}

// PUT: Update a service
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const services = readJsonFile(servicesFilePath);

    const serviceIndex = services.findIndex(
      (s: any) => s.id === parseInt(id) || s.id === id
    );
    if (serviceIndex === -1) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 }
      );
    }

    // Update service
    services[serviceIndex] = {
      ...services[serviceIndex],
      name: data.name,
      description: data.description,
      basePrice: data.basePrice,
      durationMinutes: data.durationMinutes,
      category: data.category,
      status: data.status,
      updatedAt: new Date().toISOString(),
    };

    writeJsonFile(servicesFilePath, services);
    return NextResponse.json(services[serviceIndex]);
  } catch (error) {
    console.error("Failed to update service:", error);
    return NextResponse.json(
      { message: "Failed to update service" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a service
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const services = readJsonFile(servicesFilePath);

    const serviceIndex = services.findIndex(
      (s: any) => s.id === parseInt(id) || s.id === id
    );
    if (serviceIndex === -1) {
      return NextResponse.json(
        { message: "Service not found" },
        { status: 404 }
      );
    }

    // Remove service
    services.splice(serviceIndex, 1);
    writeJsonFile(servicesFilePath, services);

    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Failed to delete service:", error);
    return NextResponse.json(
      { message: "Failed to delete service" },
      { status: 500 }
    );
  }
}
