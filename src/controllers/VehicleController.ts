import { Request, Response } from 'express';
import VehicleModel from '../models/Vehicle';
import { handleDatabaseError, handleApplicationError } from '../utils/errorHandler';
import { getPaginationParams, addPaginationMetadata, paginatedResponse } from '../utils/pagination';
import logger from '../utils/logger';
import { createAuditLog } from '../utils/auditLogger';

class VehicleController {
  /**
   * Get all vehicles (admin/staff only)
   */
  async getAllVehicles(req: Request, res: Response) {
    try {
      const pagination = getPaginationParams(req);
      const vehicles = await VehicleModel.findAll(pagination.limit, pagination.offset);
      const totalCount = await VehicleModel.countVehicles();
      
      const paginationMetadata = addPaginationMetadata(pagination, totalCount);
      
      return res.status(200).json(paginatedResponse(vehicles, paginationMetadata));
    } catch (error) {
      logger.error('Error getting all vehicles:', error);
      return handleDatabaseError(error, res, 'Failed to retrieve vehicles');
    }
  }

  /**
   * Get vehicles belonging to the authenticated user
   */
  async getMyVehicles(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const vehicles = await VehicleModel.findByUserId(userId);
      
      return res.status(200).json({ vehicles });
    } catch (error) {
      logger.error('Error getting user vehicles:', error);
      return handleDatabaseError(error, res, 'Failed to retrieve your vehicles');
    }
  }

  /**
   * Get a specific vehicle by ID
   */
  async getVehicleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const vehicle = await VehicleModel.findById(parseInt(id));
      
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
      
      // Check if the vehicle belongs to the user or user is admin/staff
      const userId = (req as any).user.id;
      const userRole = (req as any).user.role;
      
      if (vehicle.user_id !== userId && !['admin', 'staff'].includes(userRole)) {
        return res.status(403).json({ message: 'You do not have permission to view this vehicle' });
      }
      
      return res.status(200).json({ vehicle });
    } catch (error) {
      logger.error('Error getting vehicle by ID:', error);
      return handleDatabaseError(error, res, 'Failed to retrieve vehicle');
    }
  }

  /**
   * Create a new vehicle
   */
  async createVehicle(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const vehicleData = {
        ...req.body,
        user_id: userId
      };
      
      const vehicle = await VehicleModel.create(vehicleData);
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'insert',
        table_name: 'vehicles',
        record_id: vehicle.id,
        new_values: vehicleData,
        ip_address: req.ip
      });
      
      return res.status(201).json({ 
        message: 'Vehicle created successfully',
        vehicle 
      });
    } catch (error) {
      logger.error('Error creating vehicle:', error);
      return handleDatabaseError(error, res, 'Failed to create vehicle');
    }
  }

  /**
   * Update a vehicle
   */
  async updateVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const userRole = (req as any).user.role;
      
      // Get the original vehicle to check ownership and for audit logging
      const originalVehicle = await VehicleModel.findById(parseInt(id));
      
      if (!originalVehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
      
      // Check if the vehicle belongs to the user or user is admin
      if (originalVehicle.user_id !== userId && !['admin'].includes(userRole)) {
        return res.status(403).json({ message: 'You do not have permission to update this vehicle' });
      }
      
      const updatedVehicle = await VehicleModel.update(parseInt(id), userId, req.body);
      
      if (!updatedVehicle) {
        return res.status(404).json({ message: 'Vehicle not found or update failed' });
      }
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'update',
        table_name: 'vehicles',
        record_id: parseInt(id),
        old_values: originalVehicle,
        new_values: updatedVehicle,
        ip_address: req.ip
      });
      
      return res.status(200).json({ 
        message: 'Vehicle updated successfully',
        vehicle: updatedVehicle 
      });
    } catch (error) {
      logger.error('Error updating vehicle:', error);
      return handleDatabaseError(error, res, 'Failed to update vehicle');
    }
  }

  /**
   * Delete a vehicle
   */
  async deleteVehicle(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const userRole = (req as any).user.role;
      
      // Get the original vehicle to check ownership and for audit logging
      const vehicle = await VehicleModel.findById(parseInt(id));
      
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
      
      // Check if the vehicle belongs to the user or user is admin
      if (vehicle.user_id !== userId && !['admin'].includes(userRole)) {
        return res.status(403).json({ message: 'You do not have permission to delete this vehicle' });
      }
      
      const deleted = await VehicleModel.delete(parseInt(id), userId);
      
      if (!deleted) {
        return res.status(404).json({ message: 'Vehicle not found or delete failed' });
      }
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'delete',
        table_name: 'vehicles',
        record_id: parseInt(id),
        old_values: vehicle,
        ip_address: req.ip
      });
      
      return res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
      logger.error('Error deleting vehicle:', error);
      return handleDatabaseError(error, res, 'Failed to delete vehicle');
    }
  }
}

export default new VehicleController(); 