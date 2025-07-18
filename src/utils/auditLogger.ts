import db from "./db";
import logger from "./logger";

// Define types for audit log data
export interface AuditLogData {
  user_id: number;
  action: string;
  table_name: string;
  record_id?: number;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  metadata?: any;
}

export interface AuditLogFilters {
  tableName?: string;
  action?: string;
  userId?: number;
  startDate?: string;
  endDate?: string;
  limit?: number;
  offset?: number;
}

/**
 * Create an audit log entry
 */
export async function createAuditLog(data: AuditLogData): Promise<void> {
  try {
    const {
      user_id,
      action,
      table_name,
      record_id,
      old_values,
      new_values,
      ip_address,
      metadata,
    } = data;

    const query = `
      INSERT INTO audit_logs (
        user_id, action, table_name, record_id, 
        old_values, new_values, ip_address, metadata, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `;

    const values = [
      user_id,
      action,
      table_name,
      record_id,
      old_values ? JSON.stringify(old_values) : null,
      new_values ? JSON.stringify(new_values) : null,
      ip_address || null,
      metadata ? JSON.stringify(metadata) : null,
      new Date().toISOString(),
    ];

    await db.query(query, values);
    logger.info(`Audit log created for ${action} on ${table_name}`);
  } catch (error) {
    logger.error("Error creating audit log:", error);
    throw error;
  }
}

/**
 * Get audit logs for a specific record
 */
export async function getAuditLogsForRecord(
  tableName: string,
  recordId: number,
  limit: number = 100,
  offset: number = 0
): Promise<any[]> {
  try {
    const query = `
      SELECT al.*, u.first_name, u.last_name, u.email
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE al.table_name = $1 AND al.record_id = $2
      ORDER BY al.created_at DESC
      LIMIT $3 OFFSET $4
    `;

    const { rows } = await db.query(query, [
      tableName,
      recordId,
      limit,
      offset,
    ]);
    return rows;
  } catch (error) {
    logger.error("Error getting audit logs for record:", error);
    throw error;
  }
}

/**
 * Get audit logs for a specific user
 */
export async function getAuditLogsForUser(
  userId: number,
  limit: number = 100,
  offset: number = 0
): Promise<any[]> {
  try {
    const query = `
      SELECT * FROM audit_logs
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const { rows } = await db.query(query, [userId, limit, offset]);
    return rows;
  } catch (error) {
    logger.error("Error getting audit logs for user:", error);
    throw error;
  }
}

/**
 * Get audit logs with optional filters
 */
export async function getAuditLogs(
  filters: AuditLogFilters = {}
): Promise<any[]> {
  try {
    const {
      tableName,
      action,
      userId,
      startDate,
      endDate,
      limit = 100,
      offset = 0,
    } = filters;

    let query = `
      SELECT al.*, u.first_name, u.last_name, u.email
      FROM audit_logs al
      LEFT JOIN users u ON al.user_id = u.id
      WHERE 1=1
    `;

    const values: any[] = [];
    let paramIndex = 1;

    if (tableName) {
      query += ` AND al.table_name = $${paramIndex}`;
      values.push(tableName);
      paramIndex++;
    }

    if (action) {
      query += ` AND al.action = $${paramIndex}`;
      values.push(action);
      paramIndex++;
    }

    if (userId) {
      query += ` AND al.user_id = $${paramIndex}`;
      values.push(userId);
      paramIndex++;
    }

    if (startDate) {
      query += ` AND al.created_at >= $${paramIndex}`;
      values.push(startDate);
      paramIndex++;
    }

    if (endDate) {
      query += ` AND al.created_at <= $${paramIndex}`;
      values.push(endDate);
      paramIndex++;
    }

    query += `
      ORDER BY al.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    values.push(limit, offset);

    const { rows } = await db.query(query, values);
    return rows;
  } catch (error) {
    logger.error("Error getting audit logs:", error);
    throw error;
  }
}

/**
 * Helper function to log user actions
 */
export async function logUserAction(
  userId: number,
  action: string,
  tableName: string,
  recordId?: number,
  oldValues?: any,
  newValues?: any,
  ipAddress?: string,
  metadata?: any
): Promise<void> {
  await createAuditLog({
    user_id: userId,
    action,
    table_name: tableName,
    record_id: recordId,
    old_values: oldValues,
    new_values: newValues,
    ip_address: ipAddress,
    metadata,
  });
}

export default {
  createAuditLog,
  getAuditLogsForRecord,
  getAuditLogsForUser,
  getAuditLogs,
  logUserAction,
};
