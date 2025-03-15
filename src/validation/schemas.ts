import { Request, Response, NextFunction } from 'express';
import {
  validateRequiredFields,
  validateEmail,
  validateString,
  validateNumber,
  validateEnum,
  validateDate
} from '../utils/validation';
import logger from '../utils/logger';

// Middleware to check if at least one field is provided for update
export const validateAtLeastOneField = (req: Request, res: Response, next: NextFunction) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({
      message: 'At least one field must be provided for update'
    });
  }
  next();
};

// Middleware to validate phone format
export const validatePhone = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.phone && typeof req.body.phone !== 'string') {
    return res.status(400).json({
      message: 'Phone must be a string',
      field: 'phone'
    });
  }
  next();
};

// Middleware to validate time format (HH:MM)
export const validateTimeFormat = (field: string = 'scheduled_time') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const time = req.body[field];
    if (!time) {
      return next();
    }
    
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(time)) {
      return res.status(400).json({
        message: `${field} must be in HH:MM format`,
        field
      });
    }
    next();
  };
};

// User validation schemas
export const userCreateSchema = [
  validateRequiredFields(['email', 'password', 'full_name', 'role']),
  validateEmail(),
  validateString('password', 8, 100),
  validateString('full_name', 2, 100),
  validateEnum('role', ['admin', 'client', 'staff']),
  validatePhone
];

export const userUpdateSchema = [
  validateAtLeastOneField,
  validateString('full_name', 2, 100),
  validateString('password', 8, 100),
  validatePhone
];

export const loginSchema = [
  validateRequiredFields(['email', 'password']),
  validateEmail(),
  validateString('password', 1)
];

// Vehicle validation schemas
export const vehicleCreateSchema = [
  validateRequiredFields(['make', 'model', 'year', 'color', 'license_plate']),
  validateString('make', 1, 50),
  validateString('model', 1, 50),
  validateNumber('year', 1900, new Date().getFullYear() + 1),
  validateString('color', 1, 30),
  validateString('license_plate', 1, 20),
  validateString('vin', 1, 50),
  validateString('notes', 0, 500)
];

export const vehicleUpdateSchema = [
  validateAtLeastOneField,
  validateString('make', 1, 50),
  validateString('model', 1, 50),
  validateNumber('year', 1900, new Date().getFullYear() + 1),
  validateString('color', 1, 30),
  validateString('license_plate', 1, 20),
  validateString('vin', 1, 50),
  validateString('notes', 0, 500)
];

// Service validation schemas
export const serviceCreateSchema = [
  validateRequiredFields(['name', 'description', 'price', 'duration_minutes', 'category_id']),
  validateString('name', 1, 100),
  validateString('description', 1, 1000),
  validateNumber('price', 0),
  validateNumber('duration_minutes', 1),
  validateNumber('category_id', 1)
];

export const serviceUpdateSchema = [
  validateAtLeastOneField,
  validateString('name', 1, 100),
  validateString('description', 1, 1000),
  validateNumber('price', 0),
  validateNumber('duration_minutes', 1),
  validateNumber('category_id', 1)
];

export const serviceCategorySchema = [
  validateRequiredFields(['name']),
  validateString('name', 1, 50),
  validateString('description', 0, 500)
];

// Booking validation schemas
export const bookingCreateSchema = [
  validateRequiredFields(['vehicle_id', 'scheduled_date', 'scheduled_time']),
  validateNumber('vehicle_id', 1),
  validateDate('scheduled_date'),
  validateTimeFormat('scheduled_time'),
  validateString('notes', 0, 500)
];

export const bookingUpdateSchema = [
  validateAtLeastOneField,
  validateDate('scheduled_date'),
  validateTimeFormat('scheduled_time'),
  validateEnum('status', ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']),
  validateNumber('staff_id', 1),
  validateString('notes', 0, 500)
];

// Review validation schemas
export const reviewCreateSchema = [
  validateRequiredFields(['service_id', 'rating', 'title', 'content']),
  validateNumber('service_id', 1),
  validateNumber('booking_id', 1),
  validateNumber('rating', 1, 5),
  validateString('title', 1, 100),
  validateString('content', 1, 1000)
];

export const reviewUpdateSchema = [
  validateAtLeastOneField,
  validateNumber('rating', 1, 5),
  validateString('title', 1, 100),
  validateString('content', 1, 1000)
];

export const reviewStatusSchema = [
  validateRequiredFields(['status']),
  validateEnum('status', ['pending', 'approved', 'rejected'])
];

// Content validation schemas
export const contentCreateSchema = [
  validateRequiredFields(['title', 'type', 'content']),
  validateString('title', 1, 200),
  validateEnum('type', ['blog', 'faq', 'gallery', 'page']),
  validateString('content', 1, 50000),
  validateString('meta_description', 0, 500),
  validateString('meta_keywords', 0, 500),
  validateString('slug', 0, 200)
];

export const contentUpdateSchema = [
  validateAtLeastOneField,
  validateString('title', 1, 200),
  validateEnum('type', ['blog', 'faq', 'gallery', 'page']),
  validateString('content', 1, 50000),
  validateString('meta_description', 0, 500),
  validateString('meta_keywords', 0, 500),
  validateString('slug', 0, 200)
];

// Inventory validation schemas
export const inventoryCreateSchema = [
  validateRequiredFields(['name', 'description', 'category', 'sku', 'quantity', 'unit', 'min_quantity', 'cost_price']),
  validateString('name', 1, 100),
  validateString('description', 1, 500),
  validateString('category', 1, 50),
  validateString('sku', 1, 50),
  validateNumber('quantity', 0),
  validateString('unit', 1, 20),
  validateNumber('min_quantity', 0),
  validateNumber('cost_price', 0),
  validateNumber('supplier_id', 1),
  validateString('location', 0, 100)
];

export const inventoryUpdateSchema = [
  validateAtLeastOneField,
  validateString('name', 1, 100),
  validateString('description', 1, 500),
  validateString('category', 1, 50),
  validateString('sku', 1, 50),
  validateNumber('quantity', 0),
  validateString('unit', 1, 20),
  validateNumber('min_quantity', 0),
  validateNumber('cost_price', 0),
  validateNumber('supplier_id', 1),
  validateString('location', 0, 100)
];

export const inventoryQuantitySchema = [
  validateRequiredFields(['quantity']),
  validateNumber('quantity', 0),
  validateString('adjustment_reason', 0, 200)
]; 