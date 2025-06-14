import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { authenticateApi, authorizeApi, AuthenticatedRequest, handleApiError } from '@/lib/apiAuth';
import { createAuditLog } from '@/utils/auditLogger';

// Helper for validation (can be moved to a separate utils file if needed)
function validateString(value: any, minLength: number, maxLength?: number): string | null {
  if (typeof value !== 'string') {
    return 'Must be a string';
  }
  if (value.length < minLength) {
    return `Must be at least ${minLength} characters long`;
  }
  if (maxLength !== undefined && value.length > maxLength) {
    return `Must be at most ${maxLength} characters long`;
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

export async function GET(request: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult;
    }

    const authorizeResult = await authorizeApi(['admin', 'staff'])(request);
    if (authorizeResult) {
      return authorizeResult;
    }

    const { id } = params;
    const itemId = parseInt(id);

    if (isNaN(itemId)) {
      return NextResponse.json({ message: 'Invalid inventory item ID' }, { status: 400 });
    }

    const itemResult = await pool.query('SELECT * FROM inventory WHERE id = $1', [itemId]);
    const item = itemResult.rows[0];

    if (!item) {
      return NextResponse.json({ message: 'Inventory item not found' }, { status: 404 });
    }

    return NextResponse.json({ item });
  } catch (error) {
    return handleApiError(error, 'Error fetching inventory item by ID');
  }
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

    // Get original item for audit logging
    const originalItemResult = await pool.query('SELECT * FROM inventory WHERE id = $1', [itemId]);
    const originalItem = originalItemResult.rows[0];
    if (!originalItem) {
      return NextResponse.json({ message: 'Inventory item not found' }, { status: 404 });
    }

    const { name, description, quantity, unit_price, reorder_level, category } = await request.json();

    const updateFields: string[] = [];
    const updateValues: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      const nameError = validateString(name, 1, 255);
      if (nameError) return NextResponse.json({ message: `Name: ${nameError}` }, { status: 400 });
      updateFields.push(`name = $${paramIndex++}`);
      updateValues.push(name);
    }
    if (description !== undefined) {
      const descriptionError = validateString(description, 0, 1000);
      if (descriptionError) return NextResponse.json({ message: `Description: ${descriptionError}` }, { status: 400 });
      updateFields.push(`description = $${paramIndex++}`);
      updateValues.push(description);
    }
    if (quantity !== undefined) {
      const quantityError = validateNumber(quantity, 0);
      if (quantityError) return NextResponse.json({ message: `Quantity: ${quantityError}` }, { status: 400 });
      updateFields.push(`quantity = $${paramIndex++}`);
      updateValues.push(quantity);
    }
    if (unit_price !== undefined) {
      const unitPriceError = validateNumber(unit_price, 0);
      if (unitPriceError) return NextResponse.json({ message: `Unit Price: ${unitPriceError}` }, { status: 400 });
      updateFields.push(`unit_price = $${paramIndex++}`);
      updateValues.push(unit_price);
    }
    if (reorder_level !== undefined) {
      const reorderLevelError = validateNumber(reorder_level, 0);
      if (reorderLevelError) return NextResponse.json({ message: `Reorder Level: ${reorderLevelError}` }, { status: 400 });
      updateFields.push(`reorder_level = $${paramIndex++}`);
      updateValues.push(reorder_level);
    }
    if (category !== undefined) {
      updateFields.push(`category = $${paramIndex++}`);
      updateValues.push(category);
    }

    if (updateFields.length === 0) {
      return NextResponse.json({ message: 'No fields to update' }, { status: 400 });
    }

    updateFields.push(`updated_by = $${paramIndex++}`);
    updateValues.push(userId);
    updateFields.push(`updated_at = NOW()`);

    const updateQuery = `UPDATE inventory SET ${updateFields.join(', ')} WHERE id = $${paramIndex++} RETURNING *`;
    updateValues.push(itemId);

    const updatedItemResult = await pool.query(updateQuery, updateValues);
    const updatedItem = updatedItemResult.rows[0];

    await createAuditLog({
      user_id: userId!,
      action: 'update',
      table_name: 'inventory',
      record_id: itemId,
      old_values: originalItem,
      new_values: updatedItem,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    return NextResponse.json({
      message: 'Inventory item updated successfully',
      item: updatedItem
    });

  } catch (error) {
    return handleApiError(error, 'Error updating inventory item');
  }
}

export async function DELETE(request: AuthenticatedRequest, { params }: { params: { id: string } }) {
  try {
    const authResult = await authenticateApi(request);
    if (authResult) {
      return authResult;
    }

    const authorizeResult = await authorizeApi(['admin'])(request);
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

    // Get original item for audit logging
    const itemResult = await pool.query('SELECT * FROM inventory WHERE id = $1', [itemId]);
    const item = itemResult.rows[0];
    if (!item) {
      return NextResponse.json({ message: 'Inventory item not found' }, { status: 404 });
    }

    await pool.query('DELETE FROM inventory WHERE id = $1', [itemId]);

    await createAuditLog({
      user_id: userId!,
      action: 'delete',
      table_name: 'inventory',
      record_id: itemId,
      old_values: item,
      ip_address: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    return NextResponse.json({ message: 'Inventory item deleted successfully' });

  } catch (error) {
    return handleApiError(error, 'Error deleting inventory item');
  }
}