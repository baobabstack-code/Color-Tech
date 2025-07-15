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

// PUT: Update form submission status
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { status } = body;

    if (!['new', 'responded', 'closed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be new, responded, or closed' },
        { status: 400 }
      );
    }

    // Read existing submissions
    const fileContent = fs.readFileSync(submissionsFilePath, 'utf8');
    const submissions: FormSubmission[] = JSON.parse(fileContent);

    // Find and update submission
    const submissionIndex = submissions.findIndex(s => s.id === id);
    if (submissionIndex === -1) {
      return NextResponse.json(
        { error: 'Form submission not found' },
        { status: 404 }
      );
    }

    submissions[submissionIndex] = {
      ...submissions[submissionIndex],
      status,
      updatedAt: new Date().toISOString()
    };

    // Write back to file
    fs.writeFileSync(submissionsFilePath, JSON.stringify(submissions, null, 2));

    return NextResponse.json(submissions[submissionIndex]);
  } catch (error) {
    console.error('Error updating form submission:', error);
    return NextResponse.json(
      { error: 'Failed to update form submission' },
      { status: 500 }
    );
  }
}

// DELETE: Delete form submission
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    // Read existing submissions
    const fileContent = fs.readFileSync(submissionsFilePath, 'utf8');
    const submissions: FormSubmission[] = JSON.parse(fileContent);

    // Find submission
    const submissionIndex = submissions.findIndex(s => s.id === id);
    if (submissionIndex === -1) {
      return NextResponse.json(
        { error: 'Form submission not found' },
        { status: 404 }
      );
    }

    // Remove submission
    submissions.splice(submissionIndex, 1);

    // Write back to file
    fs.writeFileSync(submissionsFilePath, JSON.stringify(submissions, null, 2));

    return NextResponse.json({ message: 'Form submission deleted successfully' });
  } catch (error) {
    console.error('Error deleting form submission:', error);
    return NextResponse.json(
      { error: 'Failed to delete form submission' },
      { status: 500 }
    );
  }
}