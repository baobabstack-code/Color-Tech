import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserModel, { User } from '../models/User';
import db from '../utils/db';
import bcrypt from 'bcrypt';
import config from '../config';
import jwtConfig from '../config/jwt';

// Helper function to verify password
async function verifyPassword(user: User, password: string): Promise<boolean> {
  return bcrypt.compare(password, user.password);
}

// Helper function to generate JWT token
function generateToken(user: User): string {
  const payload = { id: user.id, email: user.email, role: user.role };
  
  // Use centralized JWT configuration
  return jwt.sign(
    payload, 
    jwtConfig.getSecret(), 
    { expiresIn: jwtConfig.getExpiresIn() } as jwt.SignOptions
  );
}

class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, password, first_name, last_name, phone } = req.body;
      
      // Check if user already exists
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      // Create new user
      const userId = await UserModel.create({
        email,
        password,
        first_name,
        last_name,
        role: 'client', // Default role for registration
        phone,
        is_active: true // Add the missing is_active field
      });
      
      // Get the created user
      const user = await UserModel.findById(userId);
      
      if (!user) {
        return res.status(500).json({ message: 'Failed to create user' });
      }
      
      // Generate JWT token
      const token = generateToken(user);
      
      // Record session
      await db.query(
        `INSERT INTO user_sessions (user_id, token, expires_at, ip_address, user_agent)
         VALUES ($1, $2, NOW() + INTERVAL '${jwtConfig.getExpiresIn()}', $3, $4)`,
        [user.id, token, req.ip, req.headers['user-agent']]
      );
      
      return res.status(201).json({
        message: 'User registered successfully',
        user,
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      
      // Find user by email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Verify password
      const isPasswordValid = await verifyPassword(user, password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      
      // Generate JWT token
      const token = generateToken(user);
      
      // Record login session
      await db.query(
        `INSERT INTO user_sessions (user_id, token, expires_at, ip_address, user_agent)
         VALUES ($1, $2, NOW() + INTERVAL '${jwtConfig.getExpiresIn()}', $3, $4)`,
        [user.id, token, req.ip, req.headers['user-agent']]
      );
      
      return res.status(200).json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          role: user.role
        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  async logout(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (token) {
        // Invalidate the token in the database
        await db.query(
          'UPDATE user_sessions SET expires_at = NOW() WHERE token = $1',
          [token]
        );
      }
      
      return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Logout error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  async getProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const user = await UserModel.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json({ user });
    } catch (error) {
      console.error('Get profile error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
  
  async updateProfile(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const { first_name, last_name, phone, password } = req.body;
      
      const updatedUser = await UserModel.update(req.user.id, {
        first_name,
        last_name,
        phone,
        password
      });
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      return res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedUser
      });
    } catch (error) {
      console.error('Update profile error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}

export default new AuthController(); 