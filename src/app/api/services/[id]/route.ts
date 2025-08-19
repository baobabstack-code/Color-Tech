import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

// Database-powered service operations

// GET: Fetch a specific service
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await DatabaseService.getServiceById(parseInt(id));

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

    const updatedService = await DatabaseService.updateService(parseInt(id), {
      name: data.name,
      description: data.description,
      duration: data.duration,
      category: data.category,
      status: typeof data.isActive === 'boolean' ? (data.isActive ? 'active' : 'inactive') : undefined,
    });

    return NextResponse.json(updatedService);
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
    await DatabaseService.deleteService(parseInt(id));

    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Failed to delete service:", error);
    return NextResponse.json(
      { message: "Failed to delete service" },
      { status: 500 }
    );
  }
}
