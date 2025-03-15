import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequiredFields, validateNumber, validateString } from '../utils/validation';
import { paginationMiddleware } from '../middleware/pagination';
import ServiceController from '../controllers/ServiceController';

const router = express.Router();

// Public routes
router.get('/', 
  paginationMiddleware, 
  ServiceController.getAllServices
);

router.get('/categories', 
  ServiceController.getServiceCategories
);

router.get('/:id', 
  ServiceController.getServiceById
);

// Admin routes
router.post('/', 
  authenticate, 
  authorize('admin'), 
  validateRequiredFields(['name', 'description', 'price', 'duration_minutes', 'category_id']),
  validateString('name', 2, 100),
  validateString('description', 10, 1000),
  validateNumber('price', 0),
  validateNumber('duration_minutes', 5),
  validateNumber('category_id', 1),
  ServiceController.createService
);

router.put('/:id', 
  authenticate, 
  authorize('admin'), 
  ServiceController.updateService
);

router.delete('/:id', 
  authenticate, 
  authorize('admin'), 
  ServiceController.deleteService
);

// Category management (admin only)
router.post('/categories', 
  authenticate, 
  authorize('admin'), 
  validateRequiredFields(['name', 'description']),
  validateString('name', 2, 50),
  validateString('description', 10, 500),
  ServiceController.createServiceCategory
);

router.put('/categories/:id', 
  authenticate, 
  authorize('admin'), 
  ServiceController.updateServiceCategory
);

router.delete('/categories/:id', 
  authenticate, 
  authorize('admin'), 
  ServiceController.deleteServiceCategory
);

export default router; 