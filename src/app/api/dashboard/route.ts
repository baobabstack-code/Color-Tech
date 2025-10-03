import { NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

// GET: Fetch aggregated dashboard data
export async function GET() {
  try {
    const dashboardData = await DatabaseService.getDashboardStats();
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    console.error("Dashboard error details:", {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    return NextResponse.json(
      {
        error: "Failed to fetch dashboard data",
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
