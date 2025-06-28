import { NextResponse } from 'next/server';
import { supabase } from '@/config/database';
import { authenticateApi, authorizeApi, AuthenticatedRequest, handleApiError } from '@/lib/apiAuth';
import { getPaginationParams } from '@/lib/utils';
import { createAuditLog } from '@/utils/auditLogger';

// Helper for validation (can be moved to a separate utils file if needed)
function validateRequiredFields(data: any, fields: string[]): string | null {
  for (const field of fields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      return `${field} is required`;
    }
  }
  return null;
}

function validateNumber(value: any, minValue: number, maxValue?: number): string | null {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return 'Must be a number';
  }
  if (num < minValue) {
    return `Must be at least ${minValue}`;
  }
  if (maxValue !== undefined && num > maxValue) {
    return `Must be at most ${maxValue}`;
  }
  return null;
}

function validateString(value: any, minLength: number, maxLength: number): string | null {
  if (typeof value !== 'string') {
    return 'Must be a string';
  }
  if (value.length < minLength) {
    return `Must be at least ${minLength} characters long`;
  }
  if (value.length > maxLength) {
    return `Must be at most ${maxLength} characters long`;
  }
  return null;
}

function validateEnum(value: string, allowedValues: string[]): boolean {
  return allowedValues.includes(value);
}

export async function GET(request: AuthenticatedRequest) {
  try {
    const authResult = await authenticateApi(request);
    const isAuthenticated = !authResult;
    const { page, limit, offset } = getPaginationParams(request);
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    // Build Supabase query
    let query = supabase
      .from('reviews')
      .select(`id, user_id, service_id, booking_id, rating, comment, status, created_at, updated_at, \
        users!inner(first_name, last_name, email), \
        services!inner(name)
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Public view: only approved reviews, or if authenticated but not admin/staff
    if (!isAuthenticated || (isAuthenticated && request.user?.role !== 'admin' && request.user?.role !== 'staff')) {
      query = query.eq('status', 'approved');
    } else {
      if (status) {
        query = query.eq('status', status);
      }
    }

    const { data: reviews, count: total, error } = await query;
    if (error) throw error;

    return NextResponse.json({
      reviews,
      pagination: {
        total: total || 0,
        page,
        limit,
        pages: total ? Math.ceil(total / limit) : 1
      }
    });
  } catch (error) {
    return handleApiError(error, 'Error fetching reviews');
  }
}

export async function POST(request: AuthenticatedRequest) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult;
    }

    const userId = request.user?.id;
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized: User ID not found' }, { status: 401 });
    }

    const { service_id, booking_id, rating, comment } = await request.json();

    // Validation
    const requiredFieldsError = validateRequiredFields(
      { service_id, booking_id, rating, comment },
      ['service_id', 'booking_id', 'rating', 'comment']
    );
    if (requiredFieldsError) {
      return NextResponse.json({ message: requiredFieldsError }, { status: 400 });
    }

    const serviceIdError = validateNumber(service_id, 1);
    if (serviceIdError) {
      return NextResponse.json({ message: `Service ID: ${serviceIdError}` }, { status: 400 });
    }
    const bookingIdError = validateNumber(booking_id, 1);
    if (bookingIdError) {
      return NextResponse.json({ message: `Booking ID: ${bookingIdError}` }, { status: 400 });
    }
    const ratingError = validateNumber(rating, 1, 5);
    if (ratingError) {
      return NextResponse.json({ message: `Rating: ${ratingError}` }, { status: 400 });
    }
    const commentError = validateString(comment, 1, 1000);
    if (commentError) {
      return NextResponse.json({ message: `Comment: ${commentError}` }, { status: 400 });
    }

    // Check if booking exists and belongs to user
    const bookingCheck = await supabase
      .from('bookings')
      .select('user_id')
      .eq('id', booking_id)
      .single();
    if (!bookingCheck.data) {
      return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
    }
    if (bookingCheck.data.user_id !== userId) {
      return NextResponse.json({ message: 'You can only review your own bookings' }, { status: 403 });
    }

    // Check if service exists
    const serviceCheck = await supabase
      .from('services')
      .select('id')
      .eq('id', service_id)
      .single();
    if (!serviceCheck.data) {
      return NextResponse.json({ message: 'Service not found' }, { status: 404 });
    }

    // Check if a review already exists for this booking and service by this user
    const existingReviewCheck = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', userId)
      .eq('booking_id', booking_id)
      .eq('service_id', service_id)
      .single();
    if (existingReviewCheck.data) {
      return NextResponse.json({ message: 'You have already submitted a review for this booking and service.' }, { status: 409 });
    }

    const { data: review, error: reviewError } = await supabase
      .from('reviews')
      .insert({
        user_id: userId,
        service_id,
        booking_id,
        rating,
        comment,
        status: 'pending',
        created_at: new Date(),
        updated_at: new Date()
      })
      .select(`*`)
      .single();

    if (reviewError) {
      throw reviewError;
    }

    await createAuditLog({
      user_id: userId!,
      action: 'insert',
      table_name: 'reviews',
      record_id: review.id,
      new_values: review,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    return NextResponse.json({
      message: 'Review submitted successfully and pending approval',
      review
    }, { status: 201 });

  } catch (error) {
    return handleApiError(error, 'Error creating review');
  }
}
