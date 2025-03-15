import { Response } from 'express';
import logger from './logger';

/**
 * Handle server errors and return appropriate response
 * @param res Express response object
 * @param error Error object
 * @param message Custom error message
 * @returns Express response with error details
 */
export const handleServerError = (res: Response, error: any, message: string = 'Internal server error'): Response => {
  // Log the error
  logger.error(`${message}: ${error.message || error}`);
  
  // Determine if this is a known error type with a specific status code
  if (error.statusCode) {
    return res.status(error.statusCode).json({
      message: error.message || message,
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
  
  // Handle specific error types
  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      message: 'A record with this information already exists',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
  
  if (error.code === 'ER_NO_REFERENCED_ROW') {
    return res.status(400).json({
      message: 'Referenced record does not exist',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
  
  // Default to 500 Internal Server Error
  return res.status(500).json({
    message,
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
};

/**
 * Create a custom error with status code
 * @param message Error message
 * @param statusCode HTTP status code
 * @returns Error object with status code
 */
export const createError = (message: string, statusCode: number = 500): Error & { statusCode: number } => {
  const error = new Error(message) as Error & { statusCode: number };
  error.statusCode = statusCode;
  return error;
};

export default {
  handleServerError,
  createError
}; 