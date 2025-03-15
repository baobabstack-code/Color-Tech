import { Request, Response, NextFunction } from 'express';
import logger from './logger';

/**
 * Validate that required fields are present in the request body
 * @param fields Array of required field names
 */
export const validateRequiredFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields = fields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      logger.warn(`Missing required fields: ${missingFields.join(', ')}`);
      return res.status(400).json({
        message: 'Missing required fields',
        fields: missingFields
      });
    }
    
    next();
  };
};

/**
 * Validate that a field is a valid email
 * @param field The field name to validate
 */
export const validateEmail = (field: string = 'email') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const email = req.body[field];
    
    if (!email) {
      return next(); // Skip validation if field is not present
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      logger.warn(`Invalid email format: ${email}`);
      return res.status(400).json({
        message: 'Invalid email format',
        field
      });
    }
    
    next();
  };
};

/**
 * Validate that a field is a valid date
 * @param field The field name to validate
 */
export const validateDate = (field: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const date = req.body[field];
    
    if (!date) {
      return next(); // Skip validation if field is not present
    }
    
    const dateObj = new Date(date);
    if (dateObj.toString() === 'Invalid Date') {
      logger.warn(`Invalid date format: ${date}`);
      return res.status(400).json({
        message: 'Invalid date format',
        field
      });
    }
    
    next();
  };
};

/**
 * Validate that a field is a valid number
 * @param field The field name to validate
 * @param min Optional minimum value
 * @param max Optional maximum value
 */
export const validateNumber = (field: string, min?: number, max?: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.body[field];
    
    if (value === undefined || value === null) {
      return next(); // Skip validation if field is not present
    }
    
    const num = Number(value);
    if (isNaN(num)) {
      logger.warn(`Invalid number format: ${value}`);
      return res.status(400).json({
        message: 'Invalid number format',
        field
      });
    }
    
    if (min !== undefined && num < min) {
      logger.warn(`Number below minimum: ${num} < ${min}`);
      return res.status(400).json({
        message: `Value must be at least ${min}`,
        field
      });
    }
    
    if (max !== undefined && num > max) {
      logger.warn(`Number above maximum: ${num} > ${max}`);
      return res.status(400).json({
        message: `Value must be at most ${max}`,
        field
      });
    }
    
    next();
  };
};

/**
 * Validate that a field is a valid string with a specific length
 * @param field The field name to validate
 * @param minLength Optional minimum length
 * @param maxLength Optional maximum length
 */
export const validateString = (field: string, minLength?: number, maxLength?: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.body[field];
    
    if (value === undefined || value === null) {
      return next(); // Skip validation if field is not present
    }
    
    if (typeof value !== 'string') {
      logger.warn(`Invalid string format: ${value}`);
      return res.status(400).json({
        message: 'Invalid string format',
        field
      });
    }
    
    if (minLength !== undefined && value.length < minLength) {
      logger.warn(`String below minimum length: ${value.length} < ${minLength}`);
      return res.status(400).json({
        message: `Field must be at least ${minLength} characters`,
        field
      });
    }
    
    if (maxLength !== undefined && value.length > maxLength) {
      logger.warn(`String above maximum length: ${value.length} > ${maxLength}`);
      return res.status(400).json({
        message: `Field must be at most ${maxLength} characters`,
        field
      });
    }
    
    next();
  };
};

/**
 * Validate that a field is one of a set of allowed values
 * @param field The field name to validate
 * @param allowedValues Array of allowed values
 */
export const validateEnum = (field: string, allowedValues: any[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const value = req.body[field];
    
    if (value === undefined || value === null) {
      return next(); // Skip validation if field is not present
    }
    
    if (!allowedValues.includes(value)) {
      logger.warn(`Invalid enum value: ${value}, allowed: ${allowedValues.join(', ')}`);
      return res.status(400).json({
        message: `Invalid value. Allowed values: ${allowedValues.join(', ')}`,
        field
      });
    }
    
    next();
  };
};

export default {
  validateRequiredFields,
  validateEmail,
  validateDate,
  validateNumber,
  validateString,
  validateEnum
}; 