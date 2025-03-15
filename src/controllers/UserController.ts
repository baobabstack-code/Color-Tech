import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User';
import { handleServerError } from '../utils/errorHandler';
import { paginationMiddleware } from '../middleware/pagination';
import logger from '../utils/logger';
import { createAuditLog } from '../utils/auditLogger';
import config from '../config';
import jwtConfig from '../config/jwt';

class UserController {
  /**
   * Register a new user
   */
  async register(req: Request, res: Response) {
    try {
      const { email, password, full_name, role, phone } = req.body;
      
      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'User with this email already exists' });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create user
      const userId = await UserModel.create({
        email,
        password: hashedPassword,
        full_name,
        role: role || 'client', // Default role is client
        phone: phone || null,
        is_active: true
      });
      
      // Log the action
      await createAuditLog({
        user_id: req.user?.id || null,
        action: 'create',
        table_name: 'users',
        record_id: userId,
        old_values: null,
        new_values: { email, full_name, role: role || 'client', phone: phone || null },
        ip_address: req.ip,
        metadata: { admin_action: req.user?.role === 'admin' }
      });
      
      logger.info(`New user registered: ${email}`);
      
      return res.status(201).json({
        message: 'User registered successfully',
        user_id: userId
      });
    } catch (error) {
      return handleServerError(res, error, 'Error registering user');
    }
  }
  
  /**
   * Login user
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Check if user is active
      if (!user.is_active) {
        return res.status(403).json({ message: 'Account is deactivated' });
      }
      
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Generate JWT token using centralized JWT configuration
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        jwtConfig.getSecret(),
        { expiresIn: jwtConfig.getExpiresIn() } as jwt.SignOptions
      );
      
      // Update last login timestamp
      await UserModel.updateLastLogin(user.id);
      
      logger.info(`User logged in: ${email}`);
      
      return res.status(200).json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          role: user.role
        }
      });
    } catch (error) {
      return handleServerError(res, error, 'Error logging in');
    }
  }
  
  /**
   * Get user profile
   */
  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Remove sensitive information
      const { password, ...userProfile } = user;
      
      return res.status(200).json(userProfile);
    } catch (error) {
      return handleServerError(res, error, 'Error fetching user profile');
    }
  }
  
  /**
   * Update user profile
   */
  async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const { full_name, phone, password } = req.body;
      
      // Get current user data for audit log
      const currentUser = await UserModel.findById(userId);
      if (!currentUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Prepare update data
      const updateData: any = {};
      if (full_name) updateData.full_name = full_name;
      if (phone !== undefined) updateData.phone = phone;
      
      // Hash new password if provided
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }
      
      // Update user
      await UserModel.update(userId, updateData);
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'update',
        table_name: 'users',
        record_id: userId,
        old_values: { full_name: currentUser.full_name, phone: currentUser.phone },
        new_values: { full_name: full_name || currentUser.full_name, phone: phone !== undefined ? phone : currentUser.phone },
        ip_address: req.ip,
        metadata: { password_changed: !!password }
      });
      
      logger.info(`User profile updated: ${currentUser.email}`);
      
      return res.status(200).json({
        message: 'Profile updated successfully'
      });
    } catch (error) {
      return handleServerError(res, error, 'Error updating user profile');
    }
  }
  
  /**
   * Get all users (admin only)
   */
  async getAllUsers(req: Request, res: Response) {
    try {
      // Apply pagination
      const { page, limit, offset } = paginationMiddleware(req);
      
      // Get users with pagination
      const users = await UserModel.findAll(limit, offset);
      const total = await UserModel.countAll();
      
      // Remove sensitive information
      const sanitizedUsers = users.map(user => {
        const { password, ...userData } = user;
        return userData;
      });
      
      return res.status(200).json({
        users: sanitizedUsers,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      return handleServerError(res, error, 'Error fetching users');
    }
  }
  
  /**
   * Get user by ID (admin only)
   */
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      const user = await UserModel.findById(parseInt(id));
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Remove sensitive information
      const { password, ...userData } = user;
      
      return res.status(200).json(userData);
    } catch (error) {
      return handleServerError(res, error, 'Error fetching user');
    }
  }
  
  /**
   * Update user (admin only)
   */
  async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = parseInt(id);
      const { full_name, email, role, phone, is_active } = req.body;
      
      // Get current user data for audit log
      const currentUser = await UserModel.findById(userId);
      if (!currentUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Prepare update data
      const updateData: any = {};
      if (full_name) updateData.full_name = full_name;
      if (email) updateData.email = email;
      if (role) updateData.role = role;
      if (phone !== undefined) updateData.phone = phone;
      if (is_active !== undefined) updateData.is_active = is_active;
      
      // Update user
      await UserModel.update(userId, updateData);
      
      // Log the action
      await createAuditLog({
        user_id: req.user?.id || null,
        action: 'update',
        table_name: 'users',
        record_id: userId,
        old_values: {
          full_name: currentUser.full_name,
          email: currentUser.email,
          role: currentUser.role,
          phone: currentUser.phone,
          is_active: currentUser.is_active
        },
        new_values: {
          full_name: full_name || currentUser.full_name,
          email: email || currentUser.email,
          role: role || currentUser.role,
          phone: phone !== undefined ? phone : currentUser.phone,
          is_active: is_active !== undefined ? is_active : currentUser.is_active
        },
        ip_address: req.ip,
        metadata: { admin_action: true }
      });
      
      logger.info(`User updated by admin: ${currentUser.email}`);
      
      return res.status(200).json({
        message: 'User updated successfully'
      });
    } catch (error) {
      return handleServerError(res, error, 'Error updating user');
    }
  }
  
  /**
   * Delete user (admin only)
   */
  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = parseInt(id);
      
      // Get user data for audit log
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Delete user
      await UserModel.delete(userId);
      
      // Log the action
      await createAuditLog({
        user_id: req.user?.id || null,
        action: 'delete',
        table_name: 'users',
        record_id: userId,
        old_values: {
          email: user.email,
          full_name: user.full_name,
          role: user.role
        },
        new_values: null,
        ip_address: req.ip,
        metadata: { admin_action: true }
      });
      
      logger.info(`User deleted by admin: ${user.email}`);
      
      return res.status(200).json({
        message: 'User deleted successfully'
      });
    } catch (error) {
      return handleServerError(res, error, 'Error deleting user');
    }
  }
  
  /**
   * Change user password
   */
  async changePassword(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const { current_password, new_password } = req.body;
      
      // Validate request
      if (!current_password || !new_password) {
        return res.status(400).json({ message: 'Current password and new password are required' });
      }
      
      // Get user
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Verify current password
      const isPasswordValid = await bcrypt.compare(current_password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Current password is incorrect' });
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(new_password, salt);
      
      // Update password
      await UserModel.update(userId, { password: hashedPassword });
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'update',
        table_name: 'users',
        record_id: userId,
        old_values: null,
        new_values: null,
        ip_address: req.ip,
        metadata: { password_changed: true }
      });
      
      logger.info(`Password changed for user: ${user.email}`);
      
      return res.status(200).json({
        message: 'Password changed successfully'
      });
    } catch (error) {
      return handleServerError(res, error, 'Error changing password');
    }
  }
  
  /**
   * Reset user password (admin only)
   */
  async resetPassword(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = parseInt(id);
      const { new_password } = req.body;
      
      // Validate request
      if (!new_password) {
        return res.status(400).json({ message: 'New password is required' });
      }
      
      // Get user
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(new_password, salt);
      
      // Update password
      await UserModel.update(userId, { password: hashedPassword });
      
      // Log the action
      await createAuditLog({
        user_id: req.user?.id || null,
        action: 'update',
        table_name: 'users',
        record_id: userId,
        old_values: null,
        new_values: null,
        ip_address: req.ip,
        metadata: { password_reset: true, admin_action: true }
      });
      
      logger.info(`Password reset by admin for user: ${user.email}`);
      
      return res.status(200).json({
        message: 'Password reset successfully'
      });
    } catch (error) {
      return handleServerError(res, error, 'Error resetting password');
    }
  }
}

export default new UserController(); 