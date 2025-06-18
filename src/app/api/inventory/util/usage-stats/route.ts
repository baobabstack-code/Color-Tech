import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateApi, authorizeApi, AuthenticatedRequest, handleApiError } from '@/lib/apiAuth';

export async function GET(request: AuthenticatedRequest) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult;
    }

    const authorizeResult = await authorizeApi(['admin'])(request);
    if (authorizeResult) {
      return authorizeResult;
    }

    const url = new URL(request.url);
    const allowedTimeframes = ['day', 'week', 'month', 'year'];
    const timeframe = url.searchParams.get('timeframe') || 'month'; // day, week, month, year
    if (!allowedTimeframes.includes(timeframe)) {
      return NextResponse.json({ message: 'Invalid timeframe parameter. Must be one of: day, week, month, year.' }, { status: 400 });
    }

    const limit = parseInt(url.searchParams.get('limit') || '10', 10);
    if (isNaN(limit) || limit <= 0) {
      return NextResponse.json({ message: 'Invalid limit parameter. Must be a positive integer.' }, { status: 400 });
    }

    let dateFilter = '';
    if (timeframe === 'day') {
      dateFilter = `AND created_at >= NOW() - INTERVAL '1 day'`;
    } else if (timeframe === 'week') {
      dateFilter = `AND created_at >= NOW() - INTERVAL '1 week'`;
    } else if (timeframe === 'month') {
      dateFilter = `AND created_at >= NOW() - INTERVAL '1 month'`;
    } else if (timeframe === 'year') {
      dateFilter = `AND created_at >= NOW() - INTERVAL '1 year'`;
    }

    const query = `
      SELECT 
        item_id,
        SUM(CASE WHEN action = 'insert' THEN (new_values->>'quantity')::numeric ELSE 0 END) AS quantity_added,
        SUM(CASE WHEN action = 'update' AND old_values->>'quantity' IS NOT NULL AND new_values->>'quantity' IS NOT NULL THEN ((new_values->>'quantity')::numeric - (old_values->>'quantity')::numeric) ELSE 0 END) AS quantity_adjusted,
        COUNT(*) AS total_audits
      FROM audit_logs
      WHERE table_name = 'inventory' ${dateFilter}
      GROUP BY item_id
      ORDER BY total_audits DESC
      LIMIT $1
    `;
    const statsResult = await pool.query(query, [limit]);

    // Fetch item names for the stats
    const itemIds = statsResult.rows.map(row => row.item_id);
    let itemsMap: { [key: number]: string } = {};
    if (itemIds.length > 0) {
      const itemsQuery = `SELECT id, name FROM inventory WHERE id = ANY($1::int[])`;
      const itemsResult = await pool.query(itemsQuery, [itemIds]);
      itemsMap = itemsResult.rows.reduce((acc, item) => {
        acc[item.id] = item.name;
        return acc;
      }, {});
    }

    const statsWithNames = statsResult.rows.map(row => ({
      ...row,
      item_name: itemsMap[row.item_id] || 'Unknown'
    }));

    return NextResponse.json({ stats: statsWithNames });
  } catch (error) {
    return handleApiError(error, 'Error fetching inventory usage statistics');
  }
}