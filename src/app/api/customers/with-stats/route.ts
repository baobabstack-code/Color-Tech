import { NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

// GET: Fetch all customers with stats
export async function GET() {
  try {
    const customersWithStats = await DatabaseService.getCustomersWithStats();
    return NextResponse.json(customersWithStats);
  } catch (error) {
    console.error("Failed to fetch customers with stats:", error);
    return NextResponse.json(
      { message: "Failed to fetch customers with stats" },
      { status: 500 }
    );
  }
}
