import db from '../utils/db';
import logger from '../utils/logger';

interface Inventory {
  id: number;
  name: string;
  description: string;
  category: string;
  sku: string;
  quantity: number;
  unit: string;
  min_quantity: number;
  cost_price: number;
  supplier_id?: number;
  location?: string;
  created_by: number;
  updated_by: number;
  created_at: Date;
  updated_at: Date;
}

interface InventoryInput {
  name: string;
  description: string;
  category: string;
  sku: string;
  quantity: number;
  unit: string;
  min_quantity: number;
  cost_price: number;
  supplier_id?: number;
  location?: string;
  created_by: number;
  updated_by: number;
}

interface InventoryUsage {
  inventory_id: number;
  name: string;
  quantity_used: number;
  unit: string;
  usage_count: number;
}

class InventoryModel {
  /**
   * Find all inventory items with pagination and optional category filtering
   */
  async findAll(
    limit: number,
    offset: number,
    category?: string
  ): Promise<Inventory[]> {
    try {
      let query = `
        SELECT i.*, s.name as supplier_name
        FROM inventory i
        LEFT JOIN suppliers s ON i.supplier_id = s.id
        WHERE 1=1
      `;
      
      const values: any[] = [];
      let paramIndex = 1;
      
      if (category) {
        query += ` AND i.category = $${paramIndex}`;
        values.push(category);
        paramIndex++;
      }
      
      query += `
        ORDER BY i.name
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      values.push(limit, offset);
      
      const { rows } = await db.query(query, values);
      return rows;
    } catch (error) {
      logger.error('Database error in InventoryModel.findAll:', error);
      throw error;
    }
  }

  /**
   * Count inventory items for pagination with optional category filtering
   */
  async countAll(category?: string): Promise<number> {
    try {
      let query = "SELECT COUNT(*) FROM inventory WHERE 1=1";
      const values: any[] = [];
      
      if (category) {
        query += " AND category = $1";
        values.push(category);
      }
      
      const { rows } = await db.query(query, values);
      return parseInt(rows[0].count);
    } catch (error) {
      logger.error('Database error in InventoryModel.countAll:', error);
      throw error;
    }
  }

  /**
   * Find inventory item by ID
   */
  async findById(id: number): Promise<Inventory | null> {
    try {
      const query = `
        SELECT i.*, s.name as supplier_name
        FROM inventory i
        LEFT JOIN suppliers s ON i.supplier_id = s.id
        WHERE i.id = $1
      `;
      const { rows } = await db.query(query, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      logger.error('Database error in InventoryModel.findById:', error);
      throw error;
    }
  }

  /**
   * Find inventory items by category with pagination
   */
  async findByCategory(
    category: string,
    limit: number,
    offset: number
  ): Promise<Inventory[]> {
    try {
      const query = `
        SELECT i.*, s.name as supplier_name
        FROM inventory i
        LEFT JOIN suppliers s ON i.supplier_id = s.id
        WHERE i.category = $1
        ORDER BY i.name
        LIMIT $2 OFFSET $3
      `;
      const { rows } = await db.query(query, [category, limit, offset]);
      return rows;
    } catch (error) {
      logger.error(`Database error in InventoryModel.findByCategory for category ${category}:`, error);
      throw error;
    }
  }

  /**
   * Count inventory items by category for pagination
   */
  async countByCategory(category: string): Promise<number> {
    try {
      const query = "SELECT COUNT(*) FROM inventory WHERE category = $1";
      const { rows } = await db.query(query, [category]);
      return parseInt(rows[0].count);
    } catch (error) {
      logger.error(`Database error in InventoryModel.countByCategory for category ${category}:`, error);
      throw error;
    }
  }

  /**
   * Find low stock inventory items with pagination
   */
  async findLowStock(limit: number, offset: number): Promise<Inventory[]> {
    try {
      const query = `
        SELECT i.*, s.name as supplier_name
        FROM inventory i
        LEFT JOIN suppliers s ON i.supplier_id = s.id
        WHERE i.quantity <= i.min_quantity
        ORDER BY (i.quantity::float / i.min_quantity) ASC
        LIMIT $1 OFFSET $2
      `;
      const { rows } = await db.query(query, [limit, offset]);
      return rows;
    } catch (error) {
      logger.error('Database error in InventoryModel.findLowStock:', error);
      throw error;
    }
  }

  /**
   * Count low stock inventory items for pagination
   */
  async countLowStock(): Promise<number> {
    try {
      const query = "SELECT COUNT(*) FROM inventory WHERE quantity <= min_quantity";
      const { rows } = await db.query(query);
      return parseInt(rows[0].count);
    } catch (error) {
      logger.error('Database error in InventoryModel.countLowStock:', error);
      throw error;
    }
  }

  /**
   * Create a new inventory item
   */
  async create(inventoryData: InventoryInput): Promise<Inventory> {
    try {
      const { 
        name, 
        description, 
        category, 
        sku, 
        quantity, 
        unit, 
        min_quantity, 
        cost_price, 
        supplier_id, 
        location, 
        created_by, 
        updated_by 
      } = inventoryData;
      
      const query = `
        INSERT INTO inventory (
          name, description, category, sku, quantity, unit, min_quantity, 
          cost_price, supplier_id, location, created_by, updated_by, 
          created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW()
        ) RETURNING *
      `;
      
      const values = [
        name, description, category, sku, quantity, unit, min_quantity,
        cost_price, supplier_id, location, created_by, updated_by
      ];
      
      const { rows } = await db.query(query, values);
      
      return rows[0];
    } catch (error) {
      logger.error('Database error in InventoryModel.create:', error);
      throw error;
    }
  }

  /**
   * Update an inventory item
   */
  async update(id: number, inventoryData: Partial<InventoryInput>): Promise<Inventory | null> {
    try {
      // First check if inventory item exists
      const inventory = await this.findById(id);
      if (!inventory) {
        return null;
      }
      
      // Build the SET clause dynamically based on provided fields
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;
      
      // Add each field that needs to be updated
      Object.entries(inventoryData).forEach(([key, value]) => {
        if (value !== undefined) {
          updates.push(`${key} = $${paramIndex}`);
          values.push(value);
          paramIndex++;
        }
      });
      
      // Add updated_at
      updates.push(`updated_at = NOW()`);
      
      // Add the ID as the last parameter
      values.push(id);
      
      const query = `
        UPDATE inventory
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;
      
      const { rows } = await db.query(query, values);
      return rows.length ? rows[0] : null;
    } catch (error) {
      logger.error('Database error in InventoryModel.update:', error);
      throw error;
    }
  }

  /**
   * Update inventory quantity and log the adjustment
   */
  async updateQuantity(
    id: number, 
    quantity: number, 
    updatedBy: number,
    adjustmentReason?: string
  ): Promise<Inventory | null> {
    try {
      // Start a transaction
      await db.query('BEGIN');
      
      // Get the current inventory item
      const currentItem = await this.findById(id);
      if (!currentItem) {
        await db.query('ROLLBACK');
        return null;
      }
      
      // Update the quantity
      const updateQuery = `
        UPDATE inventory
        SET quantity = $1, updated_by = $2, updated_at = NOW()
        WHERE id = $3
        RETURNING *
      `;
      
      const { rows } = await db.query(updateQuery, [quantity, updatedBy, id]);
      
      // Log the adjustment
      const logQuery = `
        INSERT INTO inventory_adjustments (
          inventory_id, previous_quantity, new_quantity, 
          adjustment_amount, reason, adjusted_by, created_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, NOW()
        )
      `;
      
      const adjustmentAmount = quantity - currentItem.quantity;
      
      await db.query(logQuery, [
        id, 
        currentItem.quantity, 
        quantity, 
        adjustmentAmount, 
        adjustmentReason || 'Manual adjustment', 
        updatedBy
      ]);
      
      // Commit the transaction
      await db.query('COMMIT');
      
      return rows[0];
    } catch (error) {
      // Rollback in case of error
      await db.query('ROLLBACK');
      logger.error('Database error in InventoryModel.updateQuantity:', error);
      throw error;
    }
  }

  /**
   * Delete an inventory item
   */
  async delete(id: number): Promise<boolean> {
    try {
      // Check if inventory is used in any bookings or services
      const checkQuery = `
        SELECT COUNT(*) FROM booking_inventory WHERE inventory_id = $1
      `;
      const checkResult = await db.query(checkQuery, [id]);
      
      if (parseInt(checkResult.rows[0].count) > 0) {
        // Inventory is in use, cannot delete
        return false;
      }
      
      const query = 'DELETE FROM inventory WHERE id = $1 RETURNING id';
      const { rows } = await db.query(query, [id]);
      return rows.length > 0;
    } catch (error) {
      logger.error('Database error in InventoryModel.delete:', error);
      throw error;
    }
  }

  /**
   * Get inventory categories
   */
  async getCategories(): Promise<string[]> {
    try {
      const query = `
        SELECT DISTINCT category
        FROM inventory
        ORDER BY category
      `;
      
      const { rows } = await db.query(query);
      return rows.map((row: { category: string }) => row.category);
    } catch (error) {
      logger.error('Database error in InventoryModel.getCategories:', error);
      throw error;
    }
  }

  /**
   * Get inventory usage statistics
   */
  async getUsageStats(timeframe: string = 'month', limit: number = 10): Promise<InventoryUsage[]> {
    try {
      let timeCondition = '';
      
      switch (timeframe) {
        case 'day':
          timeCondition = "WHERE bi.created_at >= NOW() - INTERVAL '1 day'";
          break;
        case 'week':
          timeCondition = "WHERE bi.created_at >= NOW() - INTERVAL '1 week'";
          break;
        case 'year':
          timeCondition = "WHERE bi.created_at >= NOW() - INTERVAL '1 year'";
          break;
        case 'month':
        default:
          timeCondition = "WHERE bi.created_at >= NOW() - INTERVAL '1 month'";
          break;
      }
      
      const query = `
        SELECT 
          bi.inventory_id,
          i.name,
          SUM(bi.quantity_used) as quantity_used,
          i.unit,
          COUNT(DISTINCT bi.booking_id) as usage_count
        FROM booking_inventory bi
        JOIN inventory i ON bi.inventory_id = i.id
        ${timeCondition}
        GROUP BY bi.inventory_id, i.name, i.unit
        ORDER BY quantity_used DESC
        LIMIT $1
      `;
      
      const { rows } = await db.query(query, [limit]);
      return rows;
    } catch (error) {
      logger.error('Database error in InventoryModel.getUsageStats:', error);
      throw error;
    }
  }
}

export default new InventoryModel(); 