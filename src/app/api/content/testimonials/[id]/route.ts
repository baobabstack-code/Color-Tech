import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

// GET: Fetch a specific testimonial
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const testimonial = await DatabaseService.getTestimonialById(parseInt(id));

    if (!testimonial) {
      return NextResponse.json(
        { message: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error("Failed to fetch testimonial:", error);
    return NextResponse.json(
      { message: "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}

// PUT: Update a testimonial
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updatedTestimonial = await DatabaseService.updateTestimonial(
      parseInt(id),
      {
        name: data.name,
        role: data.role,
        image: data.image,
        quote: data.quote,
        rating: data.rating ? parseInt(data.rating) : undefined,
        status: data.status,
        source: data.source,
      }
    );

    if (!updatedTestimonial) {
      return NextResponse.json(
        { message: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedTestimonial);
  } catch (error) {
    console.error("Failed to update testimonial:", error);
    return NextResponse.json(
      { message: "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a testimonial
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deletedTestimonial = await DatabaseService.deleteTestimonial(
      parseInt(id)
    );

    if (!deletedTestimonial) {
      return NextResponse.json(
        { message: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    console.error("Failed to delete testimonial:", error);
    return NextResponse.json(
      { message: "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}
