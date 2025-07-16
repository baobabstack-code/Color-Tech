import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

// GET: Fetch single service
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    if (isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid service ID" },
        { status: 400 }
      );
    }

    const service = await DatabaseService.getServiceById(id);
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

// PUT: Update service
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    if (isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid service ID" },
        { status: 400 }
      );
    }

    const data = await request.json();

    const updatedService = await DatabaseService.updateService(id, {
      ...(data.name && { name: data.name }),
      ...(data.description && { description: data.description }),
      ...(data.basePrice !== undefined && { basePrice: data.basePrice }),
      ...(data.duration !== undefined && { duration: data.duration }),
      ...(data.category && { category: data.category }),
      ...(data.status && { status: data.status }),
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

// DELETE: Delete service
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    if (isNaN(id)) {
      return NextResponse.json(
        { message: "Invalid service ID" },
        { status: 400 }
      );
    }

    await DatabaseService.deleteService(id);
    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error) {
    console.error("Failed to delete service:", error);
    return NextResponse.json(
      { message: "Failed to delete service" },
      { status: 500 }
    );
  }
}
