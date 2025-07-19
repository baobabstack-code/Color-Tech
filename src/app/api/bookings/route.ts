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

// GET: Fetch all bookings with customer and service details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get("customerId");
    const status = searchParams.get("status");

    const bookings = readJsonFile(bookingsFilePath);
    const customers = readJsonFile(customersFilePath);
    const services = readJsonFile(servicesFilePath);

    // Filter bookings if needed
    let filteredBookings = bookings;
    if (customerId) {
      filteredBookings = filteredBookings.filter(
        (b: any) => b.customerId === customerId
      );
    }
    if (status) {
      filteredBookings = filteredBookings.filter(
        (b: any) => b.status === status
      );
    }

    // Enrich bookings with customer and service details
    const enrichedBookings = filteredBookings.map((booking: any) => {
      const customer = customers.find((c: any) => c.id === booking.customerId);
      const service = services.find(
        (s: any) =>
          s.id === parseInt(booking.serviceId) || s.id === booking.serviceId
      );

      return {
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
    });

    return NextResponse.json(enrichedBookings);
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

    const bookings = readJsonFile(bookingsFilePath);

    // Generate new ID
    const newId =
      bookings.length > 0
        ? Math.max(...bookings.map((b: any) => parseInt(b.id))).toString()
        : "1";

    // Create new booking
    const newBooking = {
      id: (parseInt(newId) + 1).toString(),
      customerId: data.customerId,
      serviceId: data.serviceId,
      scheduledAt: data.scheduledAt,
      status: data.status || "pending",
      notes: data.notes || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to bookings array
    bookings.push(newBooking);
    writeJsonFile(bookingsFilePath, bookings);

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error) {
    console.error("Failed to create booking:", error);
    return NextResponse.json(
      { message: "Failed to create booking" },
      { status: 500 }
    );
  }
}
