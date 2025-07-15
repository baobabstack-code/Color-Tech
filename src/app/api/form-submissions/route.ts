import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const submissionsFilePath = path.join(process.cwd(), 'src/data/form-submissions.json');

interface FormSubmission {
  id: number;
  type: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  status: 'new' | 'responded' | 'closed';
  createdAt: string;
  updatedAt: string;
}

// GET: Fetch all form submissions
export async function GET() {
  try {
    const fileContent = fs.readFileSync(submissionsFilePath, 'utf8');
    const submissions: FormSubmission[] = JSON.parse(fileContent);
    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error reading form submissions:', error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST: Create new form submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, service, message, type = 'contact' } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Read existing submissions
    let submissions: FormSubmission[] = [];
    try {
      const fileContent = fs.readFileSync(submissionsFilePath, 'utf8');
      submissions = JSON.parse(fileContent);
    } catch (error) {
      // File doesn't exist or is empty, start with empty array
      submissions = [];
    }

    // Create new submission
    const newSubmission: FormSubmission = {
      id: submissions.length > 0 ? Math.max(...submissions.map(s => s.id)) + 1 : 1,
      type,
      name,
      email,
      phone,
      service,
      message,
      status: 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Add to submissions array
    submissions.push(newSubmission);

    // Write back to file
    fs.writeFileSync(submissionsFilePath, JSON.stringify(submissions, null, 2));

    return NextResponse.json(newSubmission, { status: 201 });
  } catch (error) {
    console.error('Error creating form submission:', error);
    return NextResponse.json(
      { error: 'Failed to create form submission' },
      { status: 500 }
    );
  }
}