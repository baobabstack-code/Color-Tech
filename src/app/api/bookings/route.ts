import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

// GET: Fetch all bookings with customer and service details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");
    const status = searchParams.get("status");

    let bookings = await DatabaseService.getBookings();

    // Filter bookings if needed
    if (customerId) {
      bookings = bookings.filter(
        (b: any) => b.customerId === parseInt(customerId)
      );
    }
    if (status) {
      bookings = bookings.filter((b: any) => b.status === status);
    }

    return NextResponse.json(bookings);
  } catch (error) {
    console.error("Failed to fetch bookings:", error);
    return NextResponse.json(
      { message: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST: Create a new booking
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.customerId || !data.serviceId || !data.scheduledAt) {
      return NextResponse.json(
        {
          message:
            "Missing required fields: customerId, serviceId, scheduledAt",
        },
        { status: 400 }
      );
    }

    const newBooking = await DatabaseService.createBooking({
      customer: { connect: { id: parseInt(data.customerId) } },
      service: { connect: { id: parseInt(data.serviceId) } },
      scheduledAt: new Date(data.scheduledAt),
      status: data.status || "pending",
      notes: data.notes,
    });

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error("Failed to create booking:", error);
    return NextResponse.json(
      { message: "Failed to create booking" },
      { status: 500 }
    );
  }
}
