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

// GET: Fetch all services with optional status filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let services = readJsonFile(servicesFilePath);

    if (status === "active") {
      services = services.filter((service: any) => service.status === "active");
    }

    return NextResponse.json(services);
  } catch (error) {
    console.error("Failed to fetch services:", error);
    return NextResponse.json(
      { message: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

// POST: Create a new service
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.name || data.basePrice === undefined || !data.durationMinutes) {
      return NextResponse.json(
        {
          message: "Missing required fields: name, basePrice, durationMinutes",
        },
        { status: 400 }
      );
    }

    const services = readJsonFile(servicesFilePath);

    // Generate new ID
    const newId =
      services.length > 0 ? Math.max(...services.map((s: any) => s.id)) + 1 : 1;

    // Create new service
    const newService = {
      id: newId,
      name: data.name,
      description: data.description || "",
      basePrice: data.basePrice,
      durationMinutes: data.durationMinutes,
      category: data.category || "General",
      status: data.status || "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to services array
    services.push(newService);
    writeJsonFile(servicesFilePath, services);

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error("Failed to create service:", error);
    return NextResponse.json(
      { message: "Failed to create service" },
      { status: 500 }
    );
  }
}
