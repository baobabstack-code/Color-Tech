import db from '../utils/db';
import logger from '../utils/logger';
import bcrypt from 'bcrypt';

export interface User {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'client' | 'staff';
  phone: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  last_login: Date | null;
}

export interface CreateUserData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'client' | 'staff';
  phone: string | null;
  is_active: boolean;
}

export interface UpdateUserData {
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  role?: 'admin' | 'client' | 'staff';
  phone?: string | null;
  is_active?: boolean;
}

class UserModel {
  /**
   * Find user by ID
   */
  async findById(id: number): Promise<User | null> {
    try {
      const query = `
        SELECT * FROM users
        WHERE id = $1
      `;
      
      const result = await db.query(query, [id]);
      
      if (result.rows && result.rows.length > 0) {
        return result.rows[0] as User;
      }
      
      return null;
    } catch (error) {
      logger.error(`Error finding user by ID: ${error}`);
      throw error;
    }
  }
  
  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    try {
      const query = `
        SELECT * FROM users
        WHERE email = $1
      `;
      
      const result = await db.query(query, [email]);
      
      if (result.rows && result.rows.length > 0) {
        return result.rows[0] as User;
      }
      
      return null;
    } catch (error) {
      logger.error(`Error finding user by email: ${error}`);
      throw error;
    }
  }
  
  /**
   * Find all users with pagination
   */
  async findAll(limit: number = 10, offset: number = 0): Promise<User[]> {
    try {
      const query = `
        SELECT * FROM users
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
      
      const result = await db.query(query, [limit, offset]);
      
      return result.rows as User[];
    } catch (error) {
      logger.error(`Error finding all users: ${error}`);
      throw error;
    }
  }
  
  /**
   * Count all users
   */
  async countAll(): Promise<number> {
    try {
      const query = `
        SELECT COUNT(*) as count FROM users
      `;
      
      const result = await db.query(query);
      
      return parseInt(result.rows[0].count);
    } catch (error) {
      logger.error(`Error counting users: ${error}`);
      throw error;
    }
  }
  
  /**
   * Create a new user
   */
  async create(userData: CreateUserData): Promise<number> {
    try {
      const { email, password, first_name, last_name, role, phone, is_active } = userData;
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const query = `
        INSERT INTO users (email, password, first_name, last_name, role, phone, is_active, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
        RETURNING id
      `;
      
      const result = await db.query(query, [
        email,
        hashedPassword,
        first_name,
        last_name,
        role,
        phone,
        is_active
      ]);
      
      return result.rows[0].id;
    } catch (error) {
      logger.error(`Error creating user: ${error}`);
      throw error;
    }
  }
  
  /**
   * Update user
   */
  async update(id: number, userData: UpdateUserData): Promise<boolean> {
    try {
      const updates: string[] = [];
      const values: any[] = [];
      let paramCounter = 1;
      
      if (userData.email !== undefined) {
        updates.push(`email = $${paramCounter++}`);
        values.push(userData.email);
      }
      
      if (userData.password !== undefined) {
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        updates.push(`password = $${paramCounter++}`);
        values.push(hashedPassword);
      }
      
      if (userData.first_name !== undefined) {
        updates.push(`first_name = $${paramCounter++}`);
        values.push(userData.first_name);
      }
      
      if (userData.last_name !== undefined) {
        updates.push(`last_name = $${paramCounter++}`);
        values.push(userData.last_name);
      }
      
      if (userData.role !== undefined) {
        updates.push(`role = $${paramCounter++}`);
        values.push(userData.role);
      }
      
      if (userData.phone !== undefined) {
        updates.push(`phone = $${paramCounter++}`);
        values.push(userData.phone);
      }
      
      if (userData.is_active !== undefined) {
        updates.push(`is_active = $${paramCounter++}`);
        values.push(userData.is_active);
      }
      
      if (updates.length === 0) {
        return false;
      }
      
      const query = `
        UPDATE users
        SET ${updates.join(', ')}, updated_at = NOW()
        WHERE id = $${paramCounter}
      `;
      
      values.push(id);
      
      const result = await db.query(query, values);
      
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      logger.error(`Error updating user: ${error}`);
      throw error;
    }
  }
  
  /**
   * Delete user
   */
  async delete(id: number): Promise<boolean> {
    try {
      const query = `
        DELETE FROM users
        WHERE id = $1
      `;
      
      const result = await db.query(query, [id]);
      
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      logger.error(`Error deleting user: ${error}`);
      throw error;
    }
  }
  
  /**
   * Update last login timestamp
   */
  async updateLastLogin(id: number): Promise<boolean> {
    try {
      const query = `
        UPDATE users
        SET last_login = NOW()
        WHERE id = $1
      `;
      
      const result = await db.query(query, [id]);
      
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      logger.error(`Error updating last login: ${error}`);
      throw error;
    }
  }
}

export default new UserModel(); 