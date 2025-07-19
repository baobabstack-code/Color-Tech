import { NextResponse } from "next/server";
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

// GET: Fetch aggregated dashboard data
export async function GET() {
  try {
    const bookings = readJsonFile(bookingsFilePath);
    const customers = readJsonFile(customersFilePath);
    const services = readJsonFile(servicesFilePath);

    // Calculate total revenue from completed bookings
    const completedBookings = bookings.filter(
      (booking: any) => booking.status === "completed"
    );
    const totalRevenue = completedBookings.reduce(
      (acc: number, booking: any) => {
        const service = services.find(
          (s: any) =>
            s.id === parseInt(booking.serviceId) || s.id === booking.serviceId
        );
        return acc + (service ? service.basePrice : 0);
      },
      0
    );

    // Get recent bookings with customer and service details
    const recentBookings = bookings
      .sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5)
      .map((booking: any) => {
        const customer = customers.find(
          (c: any) =>
            c.id === booking.customerId ||
            c.id === booking.customerId.toString()
        );
        const service = services.find(
          (s: any) =>
            s.id === parseInt(booking.serviceId) || s.id === booking.serviceId
        );

        return {
          ...booking,
          startTime: booking.scheduledAt, // Map scheduledAt to startTime for compatibility
          customer: customer
            ? {
                id: customer.id,
                name: customer.name,
                email: customer.email,
              }
            : { name: "Unknown Customer" },
          service: service
            ? {
                id: service.id,
                name: service.name,
                basePrice: service.basePrice,
              }
            : { name: "Unknown Service", basePrice: 0 },
        };
      });

    const dashboardData = {
      stats: {
        totalRevenue,
        totalBookings: bookings.length,
        totalCustomers: customers.length,
      },
      recentBookings,
    };

    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
