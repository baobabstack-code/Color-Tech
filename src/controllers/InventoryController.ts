import { Request, Response } from 'express';
import InventoryModel from '../models/Inventory';
import { handleServerError, createError } from '../utils/errorHandler';
import { getPaginationParams, addPaginationMetadata, paginatedResponse } from '../utils/pagination';
import logger from '../utils/logger';
import { createAuditLog } from '../utils/auditLogger';

class InventoryController {
  /**
   * Get all inventory items with pagination
   */
  async getAllInventory(req: Request, res: Response) {
    try {
      const pagination = getPaginationParams(req);
      const category = req.query.category as string | undefined;
      
      const inventory = await InventoryModel.findAll(
        pagination.limit, 
        pagination.offset,
        category
      );
      
      const totalCount = await InventoryModel.countAll(category);
      
      const paginationMetadata = addPaginationMetadata(pagination, totalCount);
      
      return res.status(200).json(paginatedResponse(inventory, paginationMetadata));
    } catch (error) {
      logger.error('Error getting all inventory:', error);
      return handleServerError(res, error, 'Failed to retrieve inventory');
    }
  }

  /**
   * Get inventory item by ID
   */
  async getInventoryById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const item = await InventoryModel.findById(parseInt(id));
      
      if (!item) {
        return res.status(404).json({ message: 'Inventory item not found' });
      }
      
      return res.status(200).json({ item });
    } catch (error) {
      logger.error('Error getting inventory by ID:', error);
      return handleServerError(res, error, 'Failed to retrieve inventory item');
    }
  }

  /**
   * Get inventory items by category
   */
  async getInventoryByCategory(req: Request, res: Response) {
    try {
      const { category } = req.params;
      const pagination = getPaginationParams(req);
      
      const inventory = await InventoryModel.findByCategory(
        category,
        pagination.limit, 
        pagination.offset
      );
      
      const totalCount = await InventoryModel.countByCategory(category);
      
      const paginationMetadata = addPaginationMetadata(pagination, totalCount);
      
      return res.status(200).json(paginatedResponse(inventory, paginationMetadata));
    } catch (error) {
      logger.error(`Error getting inventory by category ${req.params.category}:`, error);
      return handleServerError(res, error, 'Failed to retrieve inventory items');
    }
  }

  /**
   * Get low stock inventory items
   */
  async getLowStockInventory(req: Request, res: Response) {
    try {
      const pagination = getPaginationParams(req);
      
      const inventory = await InventoryModel.findLowStock(
        pagination.limit, 
        pagination.offset
      );
      
      const totalCount = await InventoryModel.countLowStock();
      
      const paginationMetadata = addPaginationMetadata(pagination, totalCount);
      
      return res.status(200).json(paginatedResponse(inventory, paginationMetadata));
    } catch (error) {
      logger.error('Error getting low stock inventory:', error);
      return handleServerError(res, error, 'Failed to retrieve low stock inventory');
    }
  }

  /**
   * Create a new inventory item
   */
  async createInventoryItem(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const itemData = {
        ...req.body,
        created_by: userId,
        updated_by: userId
      };
      
      const item = await InventoryModel.create(itemData);
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'insert',
        table_name: 'inventory',
        record_id: item.id,
        new_values: itemData,
        ip_address: req.ip
      });
      
      return res.status(201).json({ 
        message: 'Inventory item created successfully',
        item 
      });
    } catch (error) {
      logger.error('Error creating inventory item:', error);
      return handleServerError(res, error, 'Failed to create inventory item');
    }
  }

  /**
   * Update an inventory item
   */
  async updateInventoryItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Get the original item for audit logging
      const originalItem = await InventoryModel.findById(parseInt(id));
      
      if (!originalItem) {
        return res.status(404).json({ message: 'Inventory item not found' });
      }
      
      const itemData = {
        ...req.body,
        updated_by: userId,
        updated_at: new Date()
      };
      
      const updatedItem = await InventoryModel.update(parseInt(id), itemData);
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'update',
        table_name: 'inventory',
        record_id: parseInt(id),
        old_values: originalItem,
        new_values: updatedItem,
        ip_address: req.ip
      });
      
      return res.status(200).json({ 
        message: 'Inventory item updated successfully',
        item: updatedItem 
      });
    } catch (error) {
      logger.error('Error updating inventory item:', error);
      return handleServerError(res, error, 'Failed to update inventory item');
    }
  }

  /**
   * Update inventory quantity
   */
  async updateInventoryQuantity(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const { quantity, adjustment_reason } = req.body;
      
      if (quantity === undefined) {
        return res.status(400).json({ message: 'Quantity is required' });
      }
      
      // Get the original item for audit logging
      const originalItem = await InventoryModel.findById(parseInt(id));
      
      if (!originalItem) {
        return res.status(404).json({ message: 'Inventory item not found' });
      }
      
      const updatedItem = await InventoryModel.updateQuantity(
        parseInt(id),
        quantity,
        userId,
        adjustment_reason
      );
      
      if (!updatedItem) {
        return res.status(404).json({ message: 'Inventory item not found or update failed' });
      }
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'update',
        table_name: 'inventory',
        record_id: parseInt(id),
        old_values: { quantity: originalItem.quantity },
        new_values: { 
          quantity: updatedItem.quantity,
          adjustment_reason
        },
        ip_address: req.ip
      });
      
      return res.status(200).json({ 
        message: 'Inventory quantity updated successfully',
        item: updatedItem 
      });
    } catch (error) {
      logger.error('Error updating inventory quantity:', error);
      return handleServerError(res, error, 'Failed to update inventory quantity');
    }
  }

  /**
   * Delete an inventory item (admin only)
   */
  async deleteInventoryItem(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Get the original item for audit logging
      const item = await InventoryModel.findById(parseInt(id));
      
      if (!item) {
        return res.status(404).json({ message: 'Inventory item not found' });
      }
      
      await InventoryModel.delete(parseInt(id));
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'delete',
        table_name: 'inventory',
        record_id: parseInt(id),
        old_values: item,
        ip_address: req.ip
      });
      
      return res.status(200).json({ message: 'Inventory item deleted successfully' });
    } catch (error) {
      logger.error('Error deleting inventory item:', error);
      return handleServerError(res, error, 'Failed to delete inventory item');
    }
  }

  /**
   * Get inventory categories
   */
  async getInventoryCategories(req: Request, res: Response) {
    try {
      const categories = await InventoryModel.getCategories();
      
      return res.status(200).json({ categories });
    } catch (error) {
      logger.error('Error getting inventory categories:', error);
      return handleServerError(res, error, 'Failed to retrieve inventory categories');
    }
  }

  /**
   * Get inventory usage statistics (admin only)
   */
  async getInventoryUsageStats(req: Request, res: Response) {
    try {
      const timeframe = req.query.timeframe as string || 'month'; // day, week, month, year
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      
      const stats = await InventoryModel.getUsageStats(timeframe, limit);
      
      return res.status(200).json({ stats });
    } catch (error) {
      logger.error('Error getting inventory usage stats:', error);
      return handleServerError(res, error, 'Failed to retrieve inventory usage statistics');
    }
  }
}

export default new InventoryController(); 