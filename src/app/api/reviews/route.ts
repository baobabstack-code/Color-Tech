import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const reviewsFilePath = path.join(process.cwd(), "src/data/reviews.json");
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

// GET: Fetch all reviews with optional status filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let reviews = readJsonFile(reviewsFilePath);
    const customers = readJsonFile(customersFilePath);
    const services = readJsonFile(servicesFilePath);

    if (status === "published") {
      reviews = reviews.filter((review: any) => review.status === "published");
    }

    // Enrich reviews with user and service details
    const enrichedReviews = reviews.map((review: any) => {
      const user = customers.find(
        (c: any) => c.id === review.userId || c.id === review.userId.toString()
      );
      const service = services.find(
        (s: any) =>
          s.id === parseInt(review.serviceId) || s.id === review.serviceId
      );

      return {
        ...review,
        user: user
          ? {
              id: user.id,
              name: user.name,
              email: user.email,
            }
          : null,
        service: service
          ? {
              id: service.id,
              name: service.name,
            }
          : null,
      };
    });

    return NextResponse.json(enrichedReviews);
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json(
      { message: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

// POST: Create new review
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

    const reviews = readJsonFile(reviewsFilePath);
    const customers = readJsonFile(customersFilePath);
    const services = readJsonFile(servicesFilePath);

    // Generate new ID
    const newId =
      reviews.length > 0 ? Math.max(...reviews.map((r: any) => r.id)) + 1 : 1;

    // Create new review
    const newReview = {
      id: newId,
      userId: data.userId,
      serviceId: data.serviceId,
      bookingId: data.bookingId || null,
      rating: data.rating,
      comment: data.comment,
      status: data.status || "pending",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to reviews array
    reviews.push(newReview);
    writeJsonFile(reviewsFilePath, reviews);

    // Enrich with user and service details for response
    const user = customers.find(
      (c: any) => c.id === data.userId || c.id === data.userId.toString()
    );
    const service = services.find(
      (s: any) => s.id === parseInt(data.serviceId) || s.id === data.serviceId
    );

    const enrichedReview = {
      ...newReview,
      user: user
        ? {
            id: user.id,
            name: user.name,
            email: user.email,
          }
        : null,
      service: service
        ? {
            id: service.id,
            name: service.name,
          }
        : null,
    };

    return NextResponse.json(enrichedReview, { status: 201 });
  } catch (error) {
    console.error("Failed to create review:", error);
    return NextResponse.json(
      { message: "Failed to create review" },
      { status: 500 }
    );
  }
}
