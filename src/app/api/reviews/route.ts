import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

// GET: Fetch all reviews with optional status filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let reviews = await DatabaseService.getReviews();

    // Filter by status if provided
    if (status) {
      reviews = reviews.filter((review: any) => review.status === status);
    }

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json(
      { message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST: Create a new review
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.userId || !data.serviceId || !data.rating || !data.comment) {
      return NextResponse.json(
        {
          message:
            "Missing required fields: userId, serviceId, rating, comment",
        },
        { status: 400 }
      );
    }

    const newReview = await DatabaseService.createReview({
      userId: parseInt(data.userId),
      serviceId: parseInt(data.serviceId),
      bookingId: data.bookingId ? parseInt(data.bookingId) : null,
      rating: parseInt(data.rating),
      comment: data.comment,
      status: data.status || "pending",
    });

    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.json(
      { message: "Failed to create review" },
      { status: 500 }
    );
  }
}
