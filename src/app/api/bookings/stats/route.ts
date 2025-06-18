import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateApi, authorizeApi, AuthenticatedRequest, handleApiError } from '@/lib/apiAuth';

export async function GET(request: AuthenticatedRequest) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult;
    }

    const authorizeResult = await authorizeApi(['admin', 'staff'])(request);
    if (authorizeResult) {
      return authorizeResult;
    }

    const url = new URL(request.url);
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');

    let query = `
      SELECT 
        status, 
        COUNT(*) AS total_bookings,
        SUM(total_price) AS total_revenue
      FROM bookings
      WHERE 1=1
    `;
    const queryParams: string[] = [];
    let paramIndex = 1;

    if (startDate) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
        return NextResponse.json({ message: 'Invalid start_date format. Use YYYY-MM-DD' }, { status: 400 });
      }
      query += ` AND booking_date >= $${paramIndex++}`;
      queryParams.push(startDate);
    }
    if (endDate) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
        return NextResponse.json({ message: 'Invalid end_date format. Use YYYY-MM-DD' }, { status: 400 });
      }
      query += ` AND booking_date <= $${paramIndex++}`;
      queryParams.push(endDate);
    }

    query += ` GROUP BY status`;

    const statsResult = await pool.query(query, queryParams);

    // Optionally, fetch total counts and revenue across all statuses
    let totalOverallQuery = `
      SELECT 
        COUNT(*) AS overall_total_bookings,
        SUM(total_price) AS overall_total_revenue
      FROM bookings
      WHERE 1=1
    `;
    const totalOverallParams: string[] = [];
    let totalOverallParamIndex = 1;

    if (startDate) {
      // Validation already done above, just push the parameter
      totalOverallQuery += ` AND booking_date >= $${totalOverallParamIndex++}`;
      totalOverallParams.push(startDate);
    }
    if (endDate) {
      // Validation already done above, just push the parameter
      totalOverallQuery += ` AND booking_date <= $${totalOverallParamIndex++}`;
      totalOverallParams.push(endDate);
    }
    const totalOverallResult = await pool.query(totalOverallQuery, totalOverallParams);
    const overallStats = totalOverallResult.rows[0] || { overall_total_bookings: 0, overall_total_revenue: 0 };


    return NextResponse.json({
      stats_by_status: statsResult.rows,
      overall_stats: overallStats
    });

  } catch (error) {
    return handleApiError(error, 'Error fetching booking statistics');
  }
}