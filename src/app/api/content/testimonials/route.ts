import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

// GET: Fetch all testimonials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let testimonials;
    if (status === "approved") {
      testimonials = await DatabaseService.getTestimonials(); // Only approved
    } else {
      testimonials = await DatabaseService.getAllTestimonials(); // All testimonials
    }

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error("Failed to fetch testimonials:", error);
    return NextResponse.json(
      { message: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST: Create a new testimonial
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.name || !data.quote || !data.rating) {
      return NextResponse.json(
        { message: "Missing required fields: name, quote, rating" },
        { status: 400 }
      );
    }

    const newTestimonial = await DatabaseService.createTestimonial({
      name: data.name,
      role: data.role || null,
      image: data.image || null,
      quote: data.quote,
      rating: parseInt(data.rating),
      status: data.status || "pending",
      source: data.source || "website",
    });

    return NextResponse.json(newTestimonial, { status: 201 });
  } catch (error) {
    console.error("Failed to create testimonial:", error);
    return NextResponse.json(
      { message: "Failed to create testimonial" },
      { status: 500 }
    );
  }
}
