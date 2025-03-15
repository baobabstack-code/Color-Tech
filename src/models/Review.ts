import db from '../utils/db';
import logger from '../utils/logger';

interface Review {
  id: number;
  user_id: number;
  service_id: number;
  booking_id?: number;
  rating: number;
  title: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: Date;
  updated_at: Date;
}

interface ReviewInput {
  user_id: number;
  service_id: number;
  booking_id?: number;
  rating: number;
  title: string;
  content: string;
  status?: 'pending' | 'approved' | 'rejected';
}

class ReviewModel {
  /**
   * Find all public (approved) reviews with pagination
   */
  async findPublic(limit: number, offset: number): Promise<Review[]> {
    try {
      const query = `
        SELECT r.*, u.first_name, u.last_name, s.name as service_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        JOIN services s ON r.service_id = s.id
        WHERE r.status = 'approved'
        ORDER BY r.created_at DESC
        LIMIT $1 OFFSET $2
      `;
      const { rows } = await db.query(query, [limit, offset]);
      return rows;
    } catch (error) {
      logger.error('Database error in ReviewModel.findPublic:', error);
      throw error;
    }
  }

  /**
   * Count public reviews for pagination
   */
  async countPublic(): Promise<number> {
    try {
      const query = "SELECT COUNT(*) FROM reviews WHERE status = 'approved'";
      const { rows } = await db.query(query);
      return parseInt(rows[0].count);
    } catch (error) {
      logger.error('Database error in ReviewModel.countPublic:', error);
      throw error;
    }
  }

  /**
   * Find reviews by service ID with pagination
   */
  async findByServiceId(
    serviceId: number,
    limit: number,
    offset: number
  ): Promise<Review[]> {
    try {
      const query = `
        SELECT r.*, u.first_name, u.last_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        WHERE r.service_id = $1 AND r.status = 'approved'
        ORDER BY r.created_at DESC
        LIMIT $2 OFFSET $3
      `;
      const { rows } = await db.query(query, [serviceId, limit, offset]);
      return rows;
    } catch (error) {
      logger.error('Database error in ReviewModel.findByServiceId:', error);
      throw error;
    }
  }

  /**
   * Count reviews by service ID for pagination
   */
  async countByServiceId(serviceId: number): Promise<number> {
    try {
      const query = "SELECT COUNT(*) FROM reviews WHERE service_id = $1 AND status = 'approved'";
      const { rows } = await db.query(query, [serviceId]);
      return parseInt(rows[0].count);
    } catch (error) {
      logger.error('Database error in ReviewModel.countByServiceId:', error);
      throw error;
    }
  }

  /**
   * Find reviews by user ID with pagination
   */
  async findByUserId(
    userId: number,
    limit: number,
    offset: number
  ): Promise<Review[]> {
    try {
      const query = `
        SELECT r.*, s.name as service_name
        FROM reviews r
        JOIN services s ON r.service_id = s.id
        WHERE r.user_id = $1
        ORDER BY r.created_at DESC
        LIMIT $2 OFFSET $3
      `;
      const { rows } = await db.query(query, [userId, limit, offset]);
      return rows;
    } catch (error) {
      logger.error('Database error in ReviewModel.findByUserId:', error);
      throw error;
    }
  }

  /**
   * Count reviews by user ID for pagination
   */
  async countByUserId(userId: number): Promise<number> {
    try {
      const query = "SELECT COUNT(*) FROM reviews WHERE user_id = $1";
      const { rows } = await db.query(query, [userId]);
      return parseInt(rows[0].count);
    } catch (error) {
      logger.error('Database error in ReviewModel.countByUserId:', error);
      throw error;
    }
  }

  /**
   * Find all reviews with pagination (admin only)
   */
  async findAll(
    limit: number,
    offset: number,
    status?: string
  ): Promise<Review[]> {
    try {
      let query = `
        SELECT r.*, u.first_name, u.last_name, s.name as service_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        JOIN services s ON r.service_id = s.id
        WHERE 1=1
      `;
      
      const values: any[] = [];
      let paramIndex = 1;
      
      if (status) {
        query += ` AND r.status = $${paramIndex}`;
        values.push(status);
        paramIndex++;
      }
      
      query += `
        ORDER BY r.created_at DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;
      
      values.push(limit, offset);
      
      const { rows } = await db.query(query, values);
      return rows;
    } catch (error) {
      logger.error('Database error in ReviewModel.findAll:', error);
      throw error;
    }
  }

  /**
   * Count all reviews for pagination (admin only)
   */
  async countAll(status?: string): Promise<number> {
    try {
      let query = "SELECT COUNT(*) FROM reviews WHERE 1=1";
      const values: any[] = [];
      
      if (status) {
        query += " AND status = $1";
        values.push(status);
      }
      
      const { rows } = await db.query(query, values);
      return parseInt(rows[0].count);
    } catch (error) {
      logger.error('Database error in ReviewModel.countAll:', error);
      throw error;
    }
  }

  /**
   * Find review by ID
   */
  async findById(id: number): Promise<Review | null> {
    try {
      const query = `
        SELECT r.*, u.first_name, u.last_name, s.name as service_name
        FROM reviews r
        JOIN users u ON r.user_id = u.id
        JOIN services s ON r.service_id = s.id
        WHERE r.id = $1
      `;
      const { rows } = await db.query(query, [id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      logger.error('Database error in ReviewModel.findById:', error);
      throw error;
    }
  }

  /**
   * Create a new review
   */
  async create(reviewData: ReviewInput): Promise<Review> {
    try {
      const { 
        user_id, 
        service_id, 
        booking_id, 
        rating, 
        title, 
        content, 
        status = 'pending' 
      } = reviewData;
      
      const query = `
        INSERT INTO reviews (
          user_id, service_id, booking_id, rating, title, content, status, created_at, updated_at
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, NOW(), NOW()
        ) RETURNING *
      `;
      
      const values = [user_id, service_id, booking_id, rating, title, content, status];
      const { rows } = await db.query(query, values);
      
      return rows[0];
    } catch (error) {
      logger.error('Database error in ReviewModel.create:', error);
      throw error;
    }
  }

  /**
   * Update a review
   */
  async update(id: number, reviewData: Partial<ReviewInput>): Promise<Review | null> {
    try {
      // First check if review exists
      const review = await this.findById(id);
      if (!review) {
        return null;
      }
      
      // Build the SET clause dynamically based on provided fields
      const updates: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;
      
      // Add each field that needs to be updated
      Object.entries(reviewData).forEach(([key, value]) => {
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
        UPDATE reviews
        SET ${updates.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `;
      
      const { rows } = await db.query(query, values);
      return rows.length ? rows[0] : null;
    } catch (error) {
      logger.error('Database error in ReviewModel.update:', error);
      throw error;
    }
  }

  /**
   * Update review status
   */
  async updateStatus(id: number, status: 'pending' | 'approved' | 'rejected'): Promise<Review | null> {
    try {
      const query = `
        UPDATE reviews
        SET status = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *
      `;
      
      const { rows } = await db.query(query, [status, id]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      logger.error('Database error in ReviewModel.updateStatus:', error);
      throw error;
    }
  }

  /**
   * Delete a review
   */
  async delete(id: number): Promise<boolean> {
    try {
      const query = 'DELETE FROM reviews WHERE id = $1 RETURNING id';
      const { rows } = await db.query(query, [id]);
      return rows.length > 0;
    } catch (error) {
      logger.error('Database error in ReviewModel.delete:', error);
      throw error;
    }
  }
}

export default new ReviewModel(); 