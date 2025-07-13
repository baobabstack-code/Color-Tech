import { NextResponse } from 'next/server';
import { settings } from '@/lib/mock-db';

export async function GET() {
  return NextResponse.json(settings.integrations);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    settings.integrations = { ...settings.integrations, ...body };
    console.log('Updated integration settings:', settings.integrations);
    return NextResponse.json(settings.integrations);
  } catch (error) {
    console.error('Failed to update integration settings:', error);
    return NextResponse.json({ message: 'Failed to update settings' }, { status: 500 });
  }
}
