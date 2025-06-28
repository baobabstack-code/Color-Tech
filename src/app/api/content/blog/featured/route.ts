import { NextResponse } from 'next/server';
import { supabase } from '@/config/database';
import { handleApiError } from '@/lib/apiAuth';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const limitParam = url.searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 3;

    if (isNaN(limit) || limit <= 0) {
      return NextResponse.json({ message: 'Invalid limit parameter. Must be a positive integer.' }, { status: 400 });
    }

    const { data: featuredPosts, error } = await supabase
      .from('content')
      .select('*')
      .eq('content_type', 'blog')
      .eq('is_published', true)
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return NextResponse.json({ featuredPosts });
  } catch (error) {
    return handleApiError(error, 'Error fetching featured blog posts');
  }
}
