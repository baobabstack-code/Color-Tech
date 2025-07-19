import { NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

// GET: Fetch aggregated dashboard data
export async function GET() {
  try {
    const dashboardData = await DatabaseService.getDashboardStats();
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
