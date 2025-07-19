import { NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

// GET: Fetch all services with stats
export async function GET() {
  try {
    const servicesWithStats = await DatabaseService.getServicesWithStats();
    return NextResponse.json(servicesWithStats);
  } catch (error) {
    console.error("Failed to fetch services with stats:", error);
    return NextResponse.json(
      { message: "Failed to fetch services with stats" },
      { status: 500 }
    );
  }
}
