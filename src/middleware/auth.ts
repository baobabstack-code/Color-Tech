import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger';
import jwtConfig from '../config/jwt';

interface JwtPayload {
  id: number;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware to authenticate requests using JWT
 */
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }
    
    // Check if the authorization header has the correct format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ message: 'Authentication failed. Token format is invalid.' });
    }
    
    const token = parts[1];
    
    // Verify the token using centralized JWT configuration
    const decoded = jwt.verify(token, jwtConfig.getSecret()) as JwtPayload;
    
    // Attach the user info to the request
    req.user = decoded;
    
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Authentication failed. Token has expired.' });
    }
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Authentication failed. Invalid token.' });
    }
    
    return res.status(500).json({ message: 'Internal server error during authentication.' });
  }
};

/**
 * Middleware to authorize requests based on user roles
 */
export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Access denied. You do not have permission to access this resource.' 
      });
    }
    
    next();
  };
};

/**
 * Optional authentication middleware - doesn't require authentication but will
 * attach user info to the request if a valid token is provided
 */
export const optionalAuthenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return next();
    }
    
    // Check if the authorization header has the correct format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next();
    }
    
    const token = parts[1];
    
    // Verify the token using centralized JWT configuration
    const decoded = jwt.verify(token, jwtConfig.getSecret()) as JwtPayload;
    
    // Attach the user info to the request
    req.user = decoded;
    
    next();
  } catch (error) {
    // Just continue without authentication if token is invalid
    next();
  }
}; 