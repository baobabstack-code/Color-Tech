import { NextResponse } from 'next/server';
import { settings } from '@/lib/mock-db';

export async function GET() {
  return NextResponse.json(settings.general);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    settings.general = { ...settings.general, ...body };
    console.log('Updated general settings:', settings.general);
    return NextResponse.json(settings.general);
  } catch (error) {
    console.error('Failed to update general settings:', error);
    return NextResponse.json({ message: 'Failed to update settings' }, { status: 500 });
  }
}
