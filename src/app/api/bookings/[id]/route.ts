import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const bookingsFilePath = path.join(process.cwd(), "src/data/bookings.json");
const customersFilePath = path.join(process.cwd(), "src/data/customers.json");
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

// GET: Fetch a specific booking
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookings = readJsonFile(bookingsFilePath);
    const customers = readJsonFile(customersFilePath);
    const services = readJsonFile(servicesFilePath);

    const booking = bookings.find((b: any) => b.id === id);
    if (!booking) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    // Enrich with customer and service details
    const customer = customers.find((c: any) => c.id === booking.customerId);
    const service = services.find(
      (s: any) =>
        s.id === parseInt(booking.serviceId) || s.id === booking.serviceId
    );

    const enrichedBooking = {
      ...booking,
      customer: customer
        ? {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
          }
        : null,
      service: service
        ? {
            id: service.id,
            name: service.name,
            price: service.basePrice,
          }
        : null,
    };

    return NextResponse.json(enrichedBooking);
  } catch (error) {
    console.error("Failed to fetch booking:", error);
    return NextResponse.json(
      { message: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}

// PUT: Update a booking
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const bookings = readJsonFile(bookingsFilePath);

    const bookingIndex = bookings.findIndex((b: any) => b.id === id);
    if (bookingIndex === -1) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    // Update booking
    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    writeJsonFile(bookingsFilePath, bookings);
    return NextResponse.json(bookings[bookingIndex]);
  } catch (error) {
    console.error("Failed to update booking:", error);
    return NextResponse.json(
      { message: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const bookings = readJsonFile(bookingsFilePath);

    const bookingIndex = bookings.findIndex((b: any) => b.id === id);
    if (bookingIndex === -1) {
      return NextResponse.json(
        { message: "Booking not found" },
        { status: 404 }
      );
    }

    // Remove booking
    bookings.splice(bookingIndex, 1);
    writeJsonFile(bookingsFilePath, bookings);

    return NextResponse.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Failed to delete booking:", error);
    return NextResponse.json(
      { message: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
