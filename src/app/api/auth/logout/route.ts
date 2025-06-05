import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  // In a real application, you might want to add the token to a blacklist here
  // For now, we just return a success message as the client will clear the token.
  return NextResponse.json({ message: 'Logged out successfully' });
}
