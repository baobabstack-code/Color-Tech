import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const faqsFilePath = path.join(process.cwd(), 'src/data/faqs.json');

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: 'published' | 'draft';
  lastUpdated: string;
  views: number;
}

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

// GET: Fetch all FAQs
export async function GET() {
  try {
    const faqs = readJsonFile(faqsFilePath);
    return NextResponse.json(faqs);
  } catch (error) {
    console.error('Failed to fetch FAQs:', error);
    return NextResponse.json({ message: 'Failed to fetch FAQs' }, { status: 500 });
  }
}

// POST: Create a new FAQ
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Basic validation
    if (!data.question || !data.answer) {
      return NextResponse.json({ message: 'Question and answer are required' }, { status: 400 });
    }

    const faqs = readJsonFile(faqsFilePath);
    
    const newFAQ: FAQ = {
      id: (faqs.length + 1).toString(),
      question: data.question,
      answer: data.answer,
      category: data.category || 'General',
      status: data.status || 'draft',
      lastUpdated: new Date().toISOString(),
      views: 0
    };

    faqs.push(newFAQ);
    writeJsonFile(faqsFilePath, faqs);

    return NextResponse.json(newFAQ, { status: 201 });
  } catch (error) {
    console.error('Failed to create FAQ:', error);
    return NextResponse.json({ message: 'Failed to create FAQ' }, { status: 500 });
  }
}