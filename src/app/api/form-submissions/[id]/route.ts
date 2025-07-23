import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: Fetch a specific form submission
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const submission = await prisma.formSubmission.findUnique({
      where: { id: parseInt(id) },
    });

    if (!submission) {
      return NextResponse.json(
        { message: "Form submission not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(submission);
  } catch (error) {
    console.error("Failed to fetch form submission:", error);
    return NextResponse.json(
      { message: "Failed to fetch form submission" },
      { status: 500 }
    );
  }
}

// PUT: Update a form submission
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    const updatedSubmission = await prisma.formSubmission.update({
      where: { id: parseInt(id) },
      data: {
        status: data.status,
        // Add other updatable fields as needed
      },
    });

    return NextResponse.json(updatedSubmission);
  } catch (error) {
    console.error("Failed to update form submission:", error);
    return NextResponse.json(
      { message: "Failed to update form submission" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a form submission
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.formSubmission.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      message: "Form submission deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete form submission:", error);
    return NextResponse.json(
      { message: "Failed to delete form submission" },
      { status: 500 }
    );
  }
}
