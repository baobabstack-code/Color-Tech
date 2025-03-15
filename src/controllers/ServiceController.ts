import { Request, Response } from 'express';
import ServiceModel from '../models/Service';
import { handleServerError, createError } from '../utils/errorHandler';
import { getPaginationParams, addPaginationMetadata, paginatedResponse } from '../utils/pagination';
import logger from '../utils/logger';
import { createAuditLog } from '../utils/auditLogger';

class ServiceController {
  /**
   * Get all services with optional filtering
   */
  async getAllServices(req: Request, res: Response) {
    try {
      const pagination = getPaginationParams(req);
      const categoryId = req.query.category_id ? parseInt(req.query.category_id as string) : undefined;
      const isActive = req.query.is_active === 'true' ? true : 
                      req.query.is_active === 'false' ? false : undefined;
      
      const services = await ServiceModel.findAll(
        pagination.limit, 
        pagination.offset,
        categoryId,
        isActive
      );
      
      // Get total count for pagination
      const totalCount = await ServiceModel.countServices(categoryId, isActive);
      
      const paginationMetadata = addPaginationMetadata(pagination, totalCount);
      
      return res.status(200).json(paginatedResponse(services, paginationMetadata));
    } catch (error) {
      logger.error('Error getting all services:', error);
      return handleServerError(res, error, 'Failed to retrieve services');
    }
  }

  /**
   * Get service categories
   */
  async getServiceCategories(req: Request, res: Response) {
    try {
      const categories = await ServiceModel.getCategories();
      return res.status(200).json({ categories });
    } catch (error) {
      logger.error('Error getting service categories:', error);
      return handleServerError(res, error, 'Failed to retrieve service categories');
    }
  }

  /**
   * Get a specific service by ID
   */
  async getServiceById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const service = await ServiceModel.findById(parseInt(id));
      
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      
      return res.status(200).json({ service });
    } catch (error) {
      logger.error('Error getting service by ID:', error);
      return handleServerError(res, error, 'Failed to retrieve service');
    }
  }

  /**
   * Create a new service (admin only)
   */
  async createService(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const serviceData = req.body;
      
      const service = await ServiceModel.create(serviceData);
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'insert',
        table_name: 'services',
        record_id: service.id,
        new_values: serviceData,
        ip_address: req.ip
      });
      
      return res.status(201).json({ 
        message: 'Service created successfully',
        service 
      });
    } catch (error) {
      logger.error('Error creating service:', error);
      return handleServerError(res, error, 'Failed to create service');
    }
  }

  /**
   * Update a service (admin only)
   */
  async updateService(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Get the original service for audit logging
      const originalService = await ServiceModel.findById(parseInt(id));
      
      if (!originalService) {
        return res.status(404).json({ message: 'Service not found' });
      }
      
      const updatedService = await ServiceModel.update(parseInt(id), req.body);
      
      if (!updatedService) {
        return res.status(404).json({ message: 'Service not found or update failed' });
      }
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'update',
        table_name: 'services',
        record_id: parseInt(id),
        old_values: originalService,
        new_values: updatedService,
        ip_address: req.ip
      });
      
      return res.status(200).json({ 
        message: 'Service updated successfully',
        service: updatedService 
      });
    } catch (error) {
      logger.error('Error updating service:', error);
      return handleServerError(res, error, 'Failed to update service');
    }
  }

  /**
   * Delete a service (admin only)
   */
  async deleteService(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Get the original service for audit logging
      const service = await ServiceModel.findById(parseInt(id));
      
      if (!service) {
        return res.status(404).json({ message: 'Service not found' });
      }
      
      const deleted = await ServiceModel.delete(parseInt(id));
      
      if (!deleted) {
        return res.status(400).json({ 
          message: 'Service could not be deleted. It may be in use by existing bookings.' 
        });
      }
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'delete',
        table_name: 'services',
        record_id: parseInt(id),
        old_values: service,
        ip_address: req.ip
      });
      
      return res.status(200).json({ message: 'Service deleted successfully' });
    } catch (error) {
      logger.error('Error deleting service:', error);
      return handleServerError(res, error, 'Failed to delete service');
    }
  }

  /**
   * Create a new service category (admin only)
   */
  async createServiceCategory(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { name, description } = req.body;
      
      // This method needs to be implemented in the ServiceModel
      const category = await ServiceModel.createCategory({ name, description });
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'insert',
        table_name: 'service_categories',
        record_id: category.id,
        new_values: { name, description },
        ip_address: req.ip
      });
      
      return res.status(201).json({ 
        message: 'Service category created successfully',
        category 
      });
    } catch (error) {
      logger.error('Error creating service category:', error);
      return handleServerError(res, error, 'Failed to create service category');
    }
  }

  /**
   * Update a service category (admin only)
   */
  async updateServiceCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const { name, description } = req.body;
      
      // These methods need to be implemented in the ServiceModel
      const originalCategory = await ServiceModel.findCategoryById(parseInt(id));
      
      if (!originalCategory) {
        return res.status(404).json({ message: 'Service category not found' });
      }
      
      const updatedCategory = await ServiceModel.updateCategory(parseInt(id), { name, description });
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'update',
        table_name: 'service_categories',
        record_id: parseInt(id),
        old_values: originalCategory,
        new_values: updatedCategory,
        ip_address: req.ip
      });
      
      return res.status(200).json({ 
        message: 'Service category updated successfully',
        category: updatedCategory 
      });
    } catch (error) {
      logger.error('Error updating service category:', error);
      return handleServerError(res, error, 'Failed to update service category');
    }
  }

  /**
   * Delete a service category (admin only)
   */
  async deleteServiceCategory(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // These methods need to be implemented in the ServiceModel
      const category = await ServiceModel.findCategoryById(parseInt(id));
      
      if (!category) {
        return res.status(404).json({ message: 'Service category not found' });
      }
      
      const deleted = await ServiceModel.deleteCategory(parseInt(id));
      
      if (!deleted) {
        return res.status(400).json({ 
          message: 'Category could not be deleted. It may be in use by existing services.' 
        });
      }
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'delete',
        table_name: 'service_categories',
        record_id: parseInt(id),
        old_values: category,
        ip_address: req.ip
      });
      
      return res.status(200).json({ message: 'Service category deleted successfully' });
    } catch (error) {
      logger.error('Error deleting service category:', error);
      return handleServerError(res, error, 'Failed to delete service category');
    }
  }
}

export default new ServiceController(); 