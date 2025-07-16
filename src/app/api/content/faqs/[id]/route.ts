import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const faqsFilePath = path.join(process.cwd(), 'src/data/faqs.json');

// Helper function to read JSON file
const readJsonFile = (filePath: string) => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    return [];
  }
};

// Helper function to write JSON file
const writeJsonFile = (filePath: string, data: any) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// GET: Fetch single FAQ
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const faqs = readJsonFile(faqsFilePath);
    
    const faq = faqs.find((f: any) => f.id === id);
    if (!faq) {
      return NextResponse.json({ message: 'FAQ not found' }, { status: 404 });
    }
    
    return NextResponse.json(faq);
  } catch (error) {
    console.error('Failed to fetch FAQ:', error);
    return NextResponse.json({ message: 'Failed to fetch FAQ' }, { status: 500 });
  }
}

// PUT: Update FAQ
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const faqs = readJsonFile(faqsFilePath);

    const faqIndex = faqs.findIndex((f: any) => f.id === id);
    if (faqIndex === -1) {
      return NextResponse.json({ message: 'FAQ not found' }, { status: 404 });
    }

    // Update FAQ
    faqs[faqIndex] = {
      ...faqs[faqIndex],
      question: data.question || faqs[faqIndex].question,
      answer: data.answer || faqs[faqIndex].answer,
      category: data.category || faqs[faqIndex].category,
      status: data.status || faqs[faqIndex].status,
      lastUpdated: new Date().toISOString(),
      views: data.views !== undefined ? data.views : faqs[faqIndex].views
    };

    writeJsonFile(faqsFilePath, faqs);
    return NextResponse.json(faqs[faqIndex]);
  } catch (error) {
    console.error('Failed to update FAQ:', error);
    return NextResponse.json({ message: 'Failed to update FAQ' }, { status: 500 });
  }
}

// DELETE: Delete FAQ
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const faqs = readJsonFile(faqsFilePath);

    const faqIndex = faqs.findIndex((f: any) => f.id === id);
    if (faqIndex === -1) {
      return NextResponse.json({ message: 'FAQ not found' }, { status: 404 });
    }

    // Remove FAQ
    faqs.splice(faqIndex, 1);
    writeJsonFile(faqsFilePath, faqs);

    return NextResponse.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('Failed to delete FAQ:', error);
    return NextResponse.json({ message: 'Failed to delete FAQ' }, { status: 500 });
  }
}