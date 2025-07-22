import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authenticateRequest } from "@/lib/authUtils.server";

const prisma = new PrismaClient();

// GET /api/vehicles - Get all vehicles (admin) or user's vehicles
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let vehicles;
    if (user.role === "admin") {
      // Admin can see all vehicles
      vehicles = await prisma.vehicle.findMany({
        include: {
          customer: {
            select: { name: true, email: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } else {
      // Regular users can only see their own vehicles
      vehicles = await prisma.vehicle.findMany({
        where: { customerId: parseInt(user.id) },
        orderBy: { createdAt: "desc" },
      });
    }

    const transformedVehicles = vehicles.map((vehicle) => ({
      id: vehicle.id.toString(),
      userId: vehicle.customerId.toString(),
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color || "",
      licensePlate: vehicle.licensePlate || "",
      vin: vehicle.vin || "",
      notes: "",
      createdAt: vehicle.createdAt.toISOString(),
      updatedAt: vehicle.updatedAt.toISOString(),
      customer: "customer" in vehicle ? vehicle.customer : undefined,
    }));

    return NextResponse.json(transformedVehicles);
  } catch (error) {
    console.error("Error fetching vehicles:", error);
    return NextResponse.json(
      { error: "Failed to fetch vehicles" },
      { status: 500 }
    );
  }
}

// POST /api/vehicles - Create new vehicle
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const newVehicle = await prisma.vehicle.create({
      data: {
        customerId: parseInt(user.id),
        make: data.make,
        model: data.model,
        year: data.year,
        color: data.color,
        licensePlate: data.licensePlate,
        vin: data.vin,
      },
    });

    return NextResponse.json({
      id: newVehicle.id.toString(),
      userId: newVehicle.customerId.toString(),
      make: newVehicle.make,
      model: newVehicle.model,
      year: newVehicle.year,
      color: newVehicle.color || "",
      licensePlate: newVehicle.licensePlate || "",
      vin: newVehicle.vin || "",
      notes: "",
      createdAt: newVehicle.createdAt.toISOString(),
      updatedAt: newVehicle.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error creating vehicle:", error);
    return NextResponse.json(
      { error: "Failed to create vehicle" },
      { status: 500 }
    );
  }
}
