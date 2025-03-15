import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequiredFields, validateNumber, validateString } from '../utils/validation';
import { paginationMiddleware } from '../utils/pagination';
import InventoryController from '../controllers/InventoryController';

const router = express.Router();

// All inventory routes are admin/staff only
router.use(authenticate);
router.use(authorize('admin', 'staff'));

// Get all inventory items with pagination
router.get(
  '/',
  paginationMiddleware(),
  InventoryController.getAllInventory
);

// Get inventory item by ID
router.get('/:id', InventoryController.getInventoryById);

// Get inventory items by category
router.get(
  '/category/:category',
  paginationMiddleware(),
  InventoryController.getInventoryByCategory
);

// Get low stock inventory items
router.get(
  '/status/low-stock',
  paginationMiddleware(),
  InventoryController.getLowStockInventory
);

// Create new inventory item
router.post(
  '/',
  validateRequiredFields(['name', 'quantity', 'unit_price']),
  validateString('name', 1, 255),
  validateString('description', 0, 1000),
  validateNumber('quantity', 0),
  validateNumber('unit_price', 0),
  validateNumber('reorder_level', 0),
  InventoryController.createInventoryItem
);

// Update inventory item
router.put(
  '/:id',
  validateString('name', 1, 255),
  validateString('description', 0, 1000),
  validateNumber('quantity', 0),
  validateNumber('unit_price', 0),
  validateNumber('reorder_level', 0),
  InventoryController.updateInventoryItem
);

// Update inventory quantity
router.put(
  '/:id/quantity',
  validateRequiredFields(['quantity']),
  validateNumber('quantity', 0),
  InventoryController.updateInventoryQuantity
);

// Delete inventory item (admin only)
router.delete(
  '/:id',
  authorize('admin'),
  InventoryController.deleteInventoryItem
);

// Get inventory categories
router.get('/util/categories', InventoryController.getInventoryCategories);

// Get inventory usage statistics
router.get(
  '/util/usage-stats',
  authorize('admin'),
  InventoryController.getInventoryUsageStats
);

export default router; 