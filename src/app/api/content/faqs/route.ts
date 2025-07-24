import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

// GET: Fetch all FAQs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let faqs;
    if (status === "published") {
      faqs = await DatabaseService.getFAQs(); // Only published
    } else {
      faqs = await DatabaseService.getAllFAQs(); // All FAQs
    }

    return NextResponse.json(faqs);
  } catch (error) {
    console.error("Failed to fetch FAQs:", error);
    return NextResponse.json(
      { message: "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}

// POST: Create a new FAQ
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.question || !data.answer) {
      return NextResponse.json(
        { message: "Missing required fields: question, answer" },
        { status: 400 }
      );
    }

    const newFAQ = await DatabaseService.createFAQ({
      question: data.question,
      answer: data.answer,
      category: data.category || "General",
      status: data.status || "published",
      views: 0,
    });

    return NextResponse.json(newFAQ, { status: 201 });
  } catch (error) {
    console.error("Failed to create FAQ:", error);
    return NextResponse.json(
      { message: "Failed to create FAQ" },
      { status: 500 }
    );
  }
}
