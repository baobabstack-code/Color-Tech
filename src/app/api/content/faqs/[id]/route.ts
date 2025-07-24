import { NextRequest, NextResponse } from "next/server";
import { DatabaseService } from "@/lib/database";

// GET: Fetch a specific FAQ
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const faq = await DatabaseService.getFAQById(parseInt(id));

    if (!faq) {
      return NextResponse.json({ message: "FAQ not found" }, { status: 404 });
    }

    return NextResponse.json(faq);
  } catch (error) {
    console.error("Failed to fetch FAQ:", error);
    return NextResponse.json(
      { message: "Failed to fetch FAQ" },
      { status: 500 }
    );
  }
}

// PUT: Update a FAQ
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updatedFAQ = await DatabaseService.updateFAQ(parseInt(id), {
      question: data.question,
      answer: data.answer,
      category: data.category,
      status: data.status,
    });

    if (!updatedFAQ) {
      return NextResponse.json({ message: "FAQ not found" }, { status: 404 });
    }

    return NextResponse.json(updatedFAQ);
  } catch (error) {
    console.error("Failed to update FAQ:", error);
    return NextResponse.json(
      { message: "Failed to update FAQ" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a FAQ
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deletedFAQ = await DatabaseService.deleteFAQ(parseInt(id));

    if (!deletedFAQ) {
      return NextResponse.json({ message: "FAQ not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "FAQ deleted successfully" });
  } catch (error) {
    console.error("Failed to delete FAQ:", error);
    return NextResponse.json(
      { message: "Failed to delete FAQ" },
      { status: 500 }
    );
  }
}
