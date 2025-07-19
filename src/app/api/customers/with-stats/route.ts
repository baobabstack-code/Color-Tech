import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const customersFilePath = path.join(process.cwd(), "src/data/customers.json");
const bookingsFilePath = path.join(process.cwd(), "src/data/bookings.json");

// Helper function to read JSON file
const readJsonFile = (filePath: string) => {
  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
};

interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomerWithStats extends Customer {
  bookingCount: number;
  lastActivity: string;
}

// GET: Fetch all customers with stats
export async function GET() {
  try {
    const customers: Customer[] = readJsonFile(customersFilePath);
    const bookings = readJsonFile(bookingsFilePath);

    // Transform customers to include stats
    const customersWithStats: CustomerWithStats[] = customers.map(
      (customer) => {
        const customerBookings = bookings.filter(
          (booking: any) => booking.customerId === customer.id
        );
        const lastBooking = customerBookings.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];

        return {
          ...customer,
          bookingCount: customerBookings.length,
          lastActivity: lastBooking
            ? lastBooking.createdAt
            : customer.createdAt,
        };
      }
    );

    return NextResponse.json(customersWithStats);
  } catch (error) {
    console.error("Failed to fetch customers with stats:", error);
    return NextResponse.json(
      { message: "Failed to fetch customers with stats" },
      { status: 500 }
    );
  }
}
