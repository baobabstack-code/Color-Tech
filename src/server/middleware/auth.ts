import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    id?: string; // Add id as an alias for userId for backward compatibility
    role?: string;  // Make role optional since it's not in the token
  };
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, config.jwtSecret) as { userId: string };
    req.user = {
      userId: decoded.userId,
      id: decoded.userId, // Set id as an alias for userId
      role: undefined // Role will be fetched from database when needed
    };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Please authenticate' });
  }
}; 