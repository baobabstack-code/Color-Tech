import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const submissionsFilePath = path.join(
  process.cwd(),
  "src/data/form-submissions.json"
);

interface FormSubmission {
  id: number;
  type: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  status: "new" | "responded" | "closed";
  createdAt: string;
  updatedAt: string;
}

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

// GET: Fetch a specific form submission
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const submissions = readJsonFile(submissionsFilePath);
    const submission = submissions.find((s: any) => s.id === parseInt(id));

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
    const submissions = readJsonFile(submissionsFilePath);

    const submissionIndex = submissions.findIndex(
      (s: any) => s.id === parseInt(id)
    );
    if (submissionIndex === -1) {
      return NextResponse.json(
        { message: "Form submission not found" },
        { status: 404 }
      );
    }

    // Update submission
    submissions[submissionIndex] = {
      ...submissions[submissionIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };

    writeJsonFile(submissionsFilePath, submissions);
    return NextResponse.json(submissions[submissionIndex]);
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
    const submissions = readJsonFile(submissionsFilePath);

    const submissionIndex = submissions.findIndex(
      (s: any) => s.id === parseInt(id)
    );
    if (submissionIndex === -1) {
      return NextResponse.json(
        { message: "Form submission not found" },
        { status: 404 }
      );
    }

    // Remove submission
    submissions.splice(submissionIndex, 1);
    writeJsonFile(submissionsFilePath, submissions);

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
