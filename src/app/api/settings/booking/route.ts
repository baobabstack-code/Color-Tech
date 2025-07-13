import { NextResponse } from 'next/server';
import { settings } from '@/lib/mock-db';

export async function GET() {
  return NextResponse.json(settings.booking);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    settings.booking = { ...settings.booking, ...body };
    console.log('Updated booking settings:', settings.booking);
    return NextResponse.json(settings.booking);
  } catch (error) {
    console.error('Failed to update booking settings:', error);
    return NextResponse.json({ message: 'Failed to update settings' }, { status: 500 });
  }
}
