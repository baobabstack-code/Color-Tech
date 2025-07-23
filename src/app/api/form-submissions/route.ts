import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import {
  sendFormSubmissionNotification,
  sendCustomerConfirmation,
} from "@/services/emailService";

const prisma = new PrismaClient();

// GET: Fetch all form submissions
export async function GET() {
  try {
    const submissions = await prisma.formSubmission.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Error fetching form submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch form submissions" },
      { status: 500 }
    );
  }
}

// POST: Create new form submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, service, message, type = "contact" } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Create new submission in database
    const newSubmission = await prisma.formSubmission.create({
      data: {
        type,
        name,
        email,
        phone: phone || null,
        service: service || null,
        message,
        status: "new",
      },
    });

    // Send email notifications (don't wait for them to complete)
    const emailData = {
      name,
      email,
      phone,
      service,
      message,
      type,
    };

    // Send notifications asynchronously
    Promise.all([
      sendFormSubmissionNotification(emailData),
      sendCustomerConfirmation({ name, email, service }),
    ]).catch((error) => {
      console.error("Error sending email notifications:", error);
      // Don't fail the API call if emails fail
    });

    return NextResponse.json(
      {
        id: newSubmission.id,
        type: newSubmission.type,
        name: newSubmission.name,
        email: newSubmission.email,
        phone: newSubmission.phone,
        service: newSubmission.service,
        message: newSubmission.message,
        status: newSubmission.status,
        createdAt: newSubmission.createdAt.toISOString(),
        updatedAt: newSubmission.updatedAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating form submission:", error);
    return NextResponse.json(
      { error: "Failed to create form submission" },
      { status: 500 }
    );
  }
}
