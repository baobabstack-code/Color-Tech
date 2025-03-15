import db from '../utils/db';
import logger from '../utils/logger';

export interface Booking {
  id: number;
  user_id: number;
  vehicle_id: number;
  booking_date: Date;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  total_price: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
  // Joined fields
  client_name?: string;
  service_name?: string;
  service_description?: string;
}

export interface CreateBookingData {
  user_id: number;
  vehicle_id: number;
  booking_date: Date;
  start_time: string;
  end_time: string;
  total_price: number;
  notes?: string;
}

export interface UpdateBookingData {
  booking_date?: Date;
  start_time?: string;
  end_time?: string;
  status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  total_price?: number;
  staff_id?: number;
  notes?: string;
}

export interface BookingFilter {
  status?: string;
  date?: string;
  staffId?: number;
}

export interface BookingStatistics {
  total: number;
  by_status: {
    pending: number;
    confirmed: number;
    in_progress: number;
    completed: number;
    cancelled: number;
  };
  by_date: {
    date: string;
    count: number;
  }[];
  revenue: {
    total: number;
    average_per_booking: number;
  };
}

class BookingModel {
  /**
   * Create a new booking
   */
  async create(data: CreateBookingData): Promise<number> {
    try {
      const result = await db.query(
        `INSERT INTO bookings (user_id, vehicle_id, booking_date, start_time, end_time, status, total_price, notes)
         VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7)
         RETURNING id`,
        [data.user_id, data.vehicle_id, data.booking_date, data.start_time, data.end_time, data.total_price, data.notes]
      );
      
      return result.rows[0].id;
    } catch (error) {
      logger.error('Database error in BookingModel.create:', error);
      throw error;
    }
  }
  
  /**
   * Find booking by ID with joined data
   */
  async findById(id: number): Promise<Booking | null> {
    try {
      const result = await db.query(
        `SELECT b.*, CONCAT(u.first_name, ' ', u.last_name) as client_name, 
                s.name as service_name, s.description as service_description
         FROM bookings b
         LEFT JOIN users u ON b.user_id = u.id
         LEFT JOIN booking_items bi ON b.id = bi.booking_id
         LEFT JOIN services s ON bi.service_id = s.id
         WHERE b.id = $1
         LIMIT 1`,
        [id]
      );
      
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      logger.error('Database error in BookingModel.findById:', error);
      throw error;
    }
  }
  
  /**
   * Find bookings by user ID
   */
  async findByUserId(userId: number, limit: number = 10, offset: number = 0, status?: string): Promise<Booking[]> {
    try {
      let query = `
        SELECT b.*, v.make, v.model, v.license_plate,
               (SELECT STRING_AGG(s.name, ', ') 
                FROM booking_items bi 
                JOIN services s ON bi.service_id = s.id 
                WHERE bi.booking_id = b.id) as service_name
        FROM bookings b
        LEFT JOIN vehicles v ON b.vehicle_id = v.id
        WHERE b.user_id = $1`;
      
      const params: any[] = [userId];
      
      if (status) {
        query += ` AND b.status = $2`;
        params.push(status);
      }
      
      query += ` ORDER BY b.booking_date DESC, b.start_time DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);
      
      const result = await db.query(query, params);
      return result.rows;
    } catch (error) {
      logger.error('Database error in BookingModel.findByUserId:', error);
      throw error;
    }
  }
  
  /**
   * Count bookings by user ID
   */
  async countByUserId(userId: number, status?: string): Promise<number> {
    try {
      let query = `SELECT COUNT(*) as count FROM bookings WHERE user_id = $1`;
      const params: any[] = [userId];
      
      if (status) {
        query += ` AND status = $2`;
        params.push(status);
      }
      
      const result = await db.query(query, params);
      return parseInt(result.rows[0].count);
    } catch (error) {
      logger.error('Database error in BookingModel.countByUserId:', error);
      throw error;
    }
  }
  
  /**
   * Find all bookings with pagination and filtering
   */
  async findAll(limit: number = 10, offset: number = 0, filter?: BookingFilter): Promise<Booking[]> {
    try {
      let query = `
        SELECT b.*, 
               CONCAT(u.first_name, ' ', u.last_name) as client_name,
               v.make, v.model, v.license_plate,
               (SELECT STRING_AGG(s.name, ', ') 
                FROM booking_items bi 
                JOIN services s ON bi.service_id = s.id 
                WHERE bi.booking_id = b.id) as service_name
        FROM bookings b
        LEFT JOIN users u ON b.user_id = u.id
        LEFT JOIN vehicles v ON b.vehicle_id = v.id
        WHERE 1=1`;
      
      const params: any[] = [];
      
      if (filter?.status) {
        params.push(filter.status);
        query += ` AND b.status = $${params.length}`;
      }
      
      if (filter?.date) {
        params.push(filter.date);
        query += ` AND b.booking_date = $${params.length}`;
      }
      
      if (filter?.staffId) {
        params.push(filter.staffId);
        query += ` AND b.staff_id = $${params.length}`;
      }
      
      query += ` ORDER BY b.booking_date DESC, b.start_time DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
      params.push(limit, offset);
      
      const result = await db.query(query, params);
      return result.rows;
    } catch (error) {
      logger.error('Database error in BookingModel.findAll:', error);
      throw error;
    }
  }
  
  /**
   * Count all bookings with filtering
   */
  async countAll(filter?: BookingFilter): Promise<number> {
    try {
      let query = `SELECT COUNT(*) as count FROM bookings b WHERE 1=1`;
      const params: any[] = [];
      
      if (filter?.status) {
        params.push(filter.status);
        query += ` AND b.status = $${params.length}`;
      }
      
      if (filter?.date) {
        params.push(filter.date);
        query += ` AND b.booking_date = $${params.length}`;
      }
      
      if (filter?.staffId) {
        params.push(filter.staffId);
        query += ` AND b.staff_id = $${params.length}`;
      }
      
      const result = await db.query(query, params);
      return parseInt(result.rows[0].count);
    } catch (error) {
      logger.error('Database error in BookingModel.countAll:', error);
      throw error;
    }
  }
  
  /**
   * Update booking
   */
  async update(id: number, data: UpdateBookingData): Promise<boolean> {
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramCounter = 1;
      
      if (data.booking_date !== undefined) {
        updates.push(`booking_date = $${paramCounter++}`);
        values.push(data.booking_date);
      }
      
      if (data.start_time !== undefined) {
        updates.push(`start_time = $${paramCounter++}`);
        values.push(data.start_time);
      }
      
      if (data.end_time !== undefined) {
        updates.push(`end_time = $${paramCounter++}`);
        values.push(data.end_time);
      }
      
      if (data.status !== undefined) {
        updates.push(`status = $${paramCounter++}`);
        values.push(data.status);
      }
      
      if (data.total_price !== undefined) {
        updates.push(`total_price = $${paramCounter++}`);
        values.push(data.total_price);
      }
      
      if (data.staff_id !== undefined) {
        updates.push(`staff_id = $${paramCounter++}`);
        values.push(data.staff_id);
      }
      
      if (data.notes !== undefined) {
        updates.push(`notes = $${paramCounter++}`);
        values.push(data.notes);
      }
      
      if (updates.length === 0) {
        return false;
      }
      
      updates.push(`updated_at = NOW()`);
      
      const query = `
        UPDATE bookings
        SET ${updates.join(', ')}
        WHERE id = $${paramCounter}
      `;
      
      values.push(id);
      
      const result = await db.query(query, values);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      logger.error('Database error in BookingModel.update:', error);
      throw error;
    }
  }
  
  /**
   * Delete booking
   */
  async delete(id: number): Promise<boolean> {
    try {
      // First delete related booking items
      await db.query('DELETE FROM booking_items WHERE booking_id = $1', [id]);
      
      // Then delete the booking
      const result = await db.query('DELETE FROM bookings WHERE id = $1', [id]);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      logger.error('Database error in BookingModel.delete:', error);
      throw error;
    }
  }
  
  /**
   * Add service to booking
   */
  async addService(bookingId: number, serviceId: number, quantity: number = 1, price: number): Promise<number> {
    try {
      const result = await db.query(
        `INSERT INTO booking_items (booking_id, service_id, quantity, price)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [bookingId, serviceId, quantity, price]
      );
      
      // Update the total price of the booking
      await this.updateBookingTotal(bookingId);
      
      return result.rows[0].id;
    } catch (error) {
      logger.error('Database error in BookingModel.addService:', error);
      throw error;
    }
  }
  
  /**
   * Remove service from booking
   */
  async removeService(bookingId: number, serviceId: number): Promise<boolean> {
    try {
      const result = await db.query(
        'DELETE FROM booking_items WHERE booking_id = $1 AND service_id = $2',
        [bookingId, serviceId]
      );
      
      // Update the total price of the booking
      await this.updateBookingTotal(bookingId);
      
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      logger.error('Database error in BookingModel.removeService:', error);
      throw error;
    }
  }
  
  /**
   * Get services for a booking
   */
  async getBookingServices(bookingId: number): Promise<any[]> {
    try {
      const result = await db.query(
        `SELECT bi.*, s.name, s.description, s.duration_minutes
         FROM booking_items bi
         JOIN services s ON bi.service_id = s.id
         WHERE bi.booking_id = $1`,
        [bookingId]
      );
      
      return result.rows;
    } catch (error) {
      logger.error('Database error in BookingModel.getBookingServices:', error);
      throw error;
    }
  }
  
  /**
   * Update booking total price based on services
   */
  private async updateBookingTotal(bookingId: number): Promise<void> {
    try {
      await db.query(
        `UPDATE bookings
         SET total_price = (
           SELECT COALESCE(SUM(price * quantity), 0)
           FROM booking_items
           WHERE booking_id = $1
         )
         WHERE id = $1`,
        [bookingId]
      );
    } catch (error) {
      logger.error('Database error in BookingModel.updateBookingTotal:', error);
      throw error;
    }
  }
  
  /**
   * Get booking statistics
   */
  async getStatistics(startDate?: string, endDate?: string): Promise<BookingStatistics> {
    try {
      const params: any[] = [];
      let dateFilter = '';
      
      if (startDate && endDate) {
        params.push(startDate, endDate);
        dateFilter = `WHERE booking_date BETWEEN $1 AND $2`;
      }
      
      // Get total bookings and status counts
      const totalQuery = `
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'pending') as pending,
          COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed,
          COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
          COUNT(*) FILTER (WHERE status = 'completed') as completed,
          COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled,
          COALESCE(SUM(total_price), 0) as total_revenue,
          COALESCE(AVG(total_price), 0) as avg_revenue
        FROM bookings
        ${dateFilter}
      `;
      
      const totalResult = await db.query(totalQuery, params);
      
      // Get bookings by date
      const dateQuery = `
        SELECT 
          booking_date::text as date, 
          COUNT(*) as count
        FROM bookings
        ${dateFilter}
        GROUP BY booking_date
        ORDER BY booking_date DESC
        LIMIT 30
      `;
      
      const dateResult = await db.query(dateQuery, params);
      
      return {
        total: parseInt(totalResult.rows[0].total),
        by_status: {
          pending: parseInt(totalResult.rows[0].pending),
          confirmed: parseInt(totalResult.rows[0].confirmed),
          in_progress: parseInt(totalResult.rows[0].in_progress),
          completed: parseInt(totalResult.rows[0].completed),
          cancelled: parseInt(totalResult.rows[0].cancelled)
        },
        by_date: dateResult.rows.map((row: { date: string, count: string }) => ({
          date: row.date,
          count: parseInt(row.count)
        })),
        revenue: {
          total: parseFloat(totalResult.rows[0].total_revenue),
          average_per_booking: parseFloat(totalResult.rows[0].avg_revenue)
        }
      };
    } catch (error) {
      logger.error('Database error in BookingModel.getStatistics:', error);
      throw error;
    }
  }
}

export default new BookingModel(); 