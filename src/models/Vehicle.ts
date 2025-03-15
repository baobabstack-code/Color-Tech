import db from '../utils/db';
import logger from '../utils/logger';

export interface Vehicle {
  id: number;
  user_id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  vin?: string;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface VehicleInput {
  user_id: number;
  make: string;
  model: string;
  year: number;
  color: string;
  license_plate: string;
  vin?: string;
  notes?: string;
}

class VehicleModel {
  /**
   * Find all vehicles with pagination
   */
  async findAll(limit: number, offset: number): Promise<Vehicle[]> {
    try {
      const query = `
        SELECT * FROM vehicles
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
      const [rows] = await db.query(query, [limit, offset]);
      return rows;
    } catch (error) {
      logger.error('Database error in VehicleModel.findAll:', error);
      throw error;
    }
  }

  /**
   * Count total vehicles for pagination
   */
  async countVehicles(): Promise<number> {
    try {
      const query = 'SELECT COUNT(*) AS count FROM vehicles';
      const [rows] = await db.query(query);
      return parseInt(rows[0].count);
    } catch (error) {
      logger.error('Database error in VehicleModel.countVehicles:', error);
      throw error;
    }
  }

  /**
   * Find vehicles by user ID with pagination
   */
  async findByUserId(userId: number, limit: number, offset: number): Promise<Vehicle[]> {
    try {
      const query = `
        SELECT * FROM vehicles
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT $2 OFFSET $3
      `;
      const [rows] = await db.query(query, [userId, limit, offset]);
      return rows;
    } catch (error) {
      logger.error('Database error in VehicleModel.findByUserId:', error);
      throw error;
    }
  }

  /**
   * Count vehicles by user ID for pagination
   */
  async countByUserId(userId: number): Promise<number> {
    try {
      const query = 'SELECT COUNT(*) AS count FROM vehicles WHERE user_id = $1';
      const [rows] = await db.query(query, [userId]);
      return parseInt(rows[0].count);
    } catch (error) {
      logger.error('Database error in VehicleModel.countByUserId:', error);
      throw error;
    }
  }

  /**
   * Find vehicle by ID
   */
  async findById(id: number): Promise<Vehicle | null> {
    try {
      const query = 'SELECT * FROM vehicles WHERE id = $1';
      const [rows] = await db.query(query, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      logger.error('Database error in VehicleModel.findById:', error);
      throw error;
    }
  }

  /**
   * Create a new vehicle
   */
  async create(vehicleData: VehicleInput): Promise<Vehicle> {
    try {
      const { user_id, make, model, year, color, license_plate, vin, notes } = vehicleData;
      
      const query = `
        INSERT INTO vehicles (
          user_id, make, model, year, color, license_plate, vin, notes, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW()
        )
        RETURNING id
      `;
      
      const params = [user_id, make, model, year, color, license_plate, vin, notes];
      const [result] = await db.query(query, params);
      
      const id = result[0].id;
      return this.findById(id) as Promise<Vehicle>;
    } catch (error) {
      logger.error('Database error in VehicleModel.create:', error);
      throw error;
    }
  }

  /**
   * Update a vehicle
   */
  async update(id: number, vehicleData: Partial<VehicleInput>): Promise<Vehicle | null> {
    try {
      // First check if vehicle exists
      const vehicle = await this.findById(id);
      if (!vehicle) {
        return null;
      }
      
      // Build the SET clause dynamically based on provided fields
      const updates: string[] = [];
      const params: any[] = [];
      
      // Add each field that needs to be updated
      Object.entries(vehicleData).forEach(([key, value]) => {
        if (value !== undefined) {
          updates.push(`${key} = $${params.length + 1}`);
          params.push(value);
        }
      });
      
      // Add updated_at
      updates.push(`updated_at = NOW()`);
      
      // Add the ID as the last parameter
      params.push(id);
      
      const query = `
        UPDATE vehicles
        SET ${updates.join(', ')}
        WHERE id = $${params.length}
        RETURNING *
      `;
      
      await db.query(query, params);
      return this.findById(id);
    } catch (error) {
      logger.error('Database error in VehicleModel.update:', error);
      throw error;
    }
  }

  /**
   * Delete a vehicle
   */
  async delete(id: number): Promise<boolean> {
    try {
      // Check if vehicle is used in any bookings
      const checkQuery = `
        SELECT COUNT(*) AS count FROM bookings WHERE vehicle_id = $1
      `;
      const [checkResult] = await db.query(checkQuery, [id]);
      
      if (parseInt(checkResult[0].count) > 0) {
        // Vehicle is in use, cannot delete
        return false;
      }
      
      const query = 'DELETE FROM vehicles WHERE id = $1 RETURNING id';
      const [result] = await db.query(query, [id]);
      return result.length > 0;
    } catch (error) {
      logger.error('Database error in VehicleModel.delete:', error);
      throw error;
    }
  }
}

export default new VehicleModel(); 