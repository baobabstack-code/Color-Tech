import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

// GET: Fetch all services with optional status filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let services = await DatabaseService.getServices();

    if (status === "active") {
      services = services.filter((service: any) => service.status === "active");
    }

    return NextResponse.json(services);
  } catch (error) {
    console.error("Failed to fetch services:", error);
    console.error("Services fetch error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    return NextResponse.json(
      {
        message: "Failed to fetch services",
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// POST: Create a new service
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.name || data.duration === undefined) {
      return NextResponse.json(
        {
          message: "Missing required fields: name, duration",
        },
        { status: 400 }
      );
    }

    // Create new service
    const newService = await DatabaseService.createService({
      name: data.name,
      description: data.description || "",
      duration: data.duration,
      category: data.category || "General",
      status: data.isActive ? "active" : "inactive",
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error("Failed to create service:", error);
    return NextResponse.json(
      { message: "Failed to create service" },
      { status: 500 }
    );
  }
}
