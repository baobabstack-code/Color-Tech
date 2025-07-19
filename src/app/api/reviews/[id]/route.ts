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

// GET: Fetch single review
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reviews = readJsonFile(reviewsFilePath);
    const customers = readJsonFile(customersFilePath);
    const services = readJsonFile(servicesFilePath);

    const review = reviews.find((r: any) => r.id === parseInt(id));

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Enrich with user and service details
    const user = customers.find(
      (c: any) => c.id === review.userId || c.id === review.userId.toString()
    );
    const service = services.find(
      (s: any) =>
        s.id === parseInt(review.serviceId) || s.id === review.serviceId
    );

    const enrichedReview = {
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

    return NextResponse.json(enrichedReview);
  } catch (error) {
    console.error("Error fetching review:", error);
    return NextResponse.json(
      { error: "Failed to fetch review" },
      { status: 500 }
    );
  }
}

// PUT: Update review
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const reviews = readJsonFile(reviewsFilePath);
    const customers = readJsonFile(customersFilePath);
    const services = readJsonFile(servicesFilePath);

    const reviewIndex = reviews.findIndex((r: any) => r.id === parseInt(id));

    if (reviewIndex === -1) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Update review
    reviews[reviewIndex] = {
      ...reviews[reviewIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    writeJsonFile(reviewsFilePath, reviews);

    // Enrich with user and service details for response
    const user = customers.find(
      (c: any) =>
        c.id === reviews[reviewIndex].userId ||
        c.id === reviews[reviewIndex].userId.toString()
    );
    const service = services.find(
      (s: any) =>
        s.id === parseInt(reviews[reviewIndex].serviceId) ||
        s.id === reviews[reviewIndex].serviceId
    );

    const enrichedReview = {
      ...reviews[reviewIndex],
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

    return NextResponse.json(enrichedReview);
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }
}

// DELETE: Delete review
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const reviews = readJsonFile(reviewsFilePath);
    const reviewIndex = reviews.findIndex((r: any) => r.id === parseInt(id));

    if (reviewIndex === -1) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    // Remove review
    reviews.splice(reviewIndex, 1);
    writeJsonFile(reviewsFilePath, reviews);

    return NextResponse.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    return NextResponse.json(
      { error: "Failed to delete review" },
      { status: 500 }
    );
  }
}
