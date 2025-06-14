import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateApi, authorizeApi, AuthenticatedRequest, handleApiError } from '@/lib/apiAuth';
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

function validateNumber(value: any, minValue: number): string | null {
  const num = parseFloat(value);
  if (isNaN(num)) {
    return 'Must be a number';
  }
  if (num < minValue) {
    return `Must be at least ${minValue}`;
  }
  return null;
}

export async function PUT(request: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult;
    }

    const authorizeResult = await authorizeApi(['admin', 'staff'])(request);
    if (authorizeResult) {
      return authorizeResult;
    }

    const userId = request.user?.id;
    if (!userId) {
      return NextResponse.json({ message: 'Unauthorized: User ID not found' }, { status: 401 });
    }

    const { id } = params;
    const itemId = parseInt(id);

    if (isNaN(itemId)) {
      return NextResponse.json({ message: 'Invalid inventory item ID' }, { status: 400 });
    }

    const { quantity, adjustment_reason } = await request.json();

    const requiredFieldsError = validateRequiredFields(
      { quantity },
      ['quantity']
    );
    if (requiredFieldsError) {
      return NextResponse.json({ message: requiredFieldsError }, { status: 400 });
    }

    const quantityError = validateNumber(quantity, 0);
    if (quantityError) {
      return NextResponse.json({ message: `Quantity: ${quantityError}` }, { status: 400 });
    }

    // Get the original item for audit logging
    const originalItemResult = await pool.query('SELECT * FROM inventory WHERE id = $1', [itemId]);
    const originalItem = originalItemResult.rows[0];
    if (!originalItem) {
      return NextResponse.json({ message: 'Inventory item not found' }, { status: 404 });
    }

    const updatedItemResult = await pool.query(
      `UPDATE inventory SET quantity = $1, updated_by = $2, updated_at = NOW() WHERE id = $3 RETURNING *`,
      [quantity, userId, itemId]
    );
    const updatedItem = updatedItemResult.rows[0];

    await createAuditLog({
      user_id: userId!,
      action: 'update',
      table_name: 'inventory',
      record_id: itemId,
      old_values: { quantity: originalItem.quantity },
      new_values: {
        quantity: updatedItem.quantity,
        adjustment_reason: adjustment_reason || null
      },
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    return NextResponse.json({
      message: 'Inventory quantity updated successfully',
      item: updatedItem
    });

  } catch (error) {
    return handleApiError(error, 'Error updating inventory quantity');
  }
}