import { Request, Response } from 'express';
import BookingModel from '../models/Booking';
import VehicleModel from '../models/Vehicle';
import ServiceModel from '../models/Service';
import { handleServerError } from '../utils/errorHandler';
import { paginationMiddleware } from '../middleware/pagination';
import logger from '../utils/logger';
import { createAuditLog } from '../utils/auditLogger';
import db from '../utils/db';

class BookingController {
  /**
   * Get all bookings (admin/staff only)
   */
  async getAllBookings(req: Request, res: Response) {
    try {
      // Apply pagination
      const { page, limit, offset } = paginationMiddleware(req);
      
      // Get filter parameters
      const status = req.query.status as string;
      const date = req.query.date as string;
      const staffId = req.query.staff_id ? parseInt(req.query.staff_id as string) : undefined;
      
      // Get bookings with pagination and filters
      const bookings = await BookingModel.findAll(limit, offset, { status, date, staffId });
      const total = await BookingModel.countAll({ status, date, staffId });
      
      return res.status(200).json({
        bookings,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      return handleServerError(res, error, 'Error fetching bookings');
    }
  }
  
  /**
   * Get bookings for the authenticated user
   */
  async getMyBookings(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      // Apply pagination
      const { page, limit, offset } = paginationMiddleware(req);
      
      // Get filter parameters
      const status = req.query.status as string;
      
      // Get user's bookings with pagination
      const bookings = await BookingModel.findByUserId(userId, limit, offset, status);
      const total = await BookingModel.countByUserId(userId, status);
      
      return res.status(200).json({
        bookings,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      return handleServerError(res, error, 'Error fetching user bookings');
    }
  }
  
  /**
   * Get booking by ID
   */
  async getBookingById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const userRole = req.user?.role;
      
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const booking = await BookingModel.findById(parseInt(id));
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      // Check if user has permission to view this booking
      if (userRole !== 'admin' && userRole !== 'staff' && booking.user_id !== userId) {
        return res.status(403).json({ message: 'You do not have permission to view this booking' });
      }
      
      return res.status(200).json(booking);
    } catch (error) {
      return handleServerError(res, error, 'Error fetching booking');
    }
  }
  
  /**
   * Create a new booking
   */
  async createBooking(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const { vehicle_id, service_ids, scheduled_date, scheduled_time, notes } = req.body;
      
      // Verify vehicle belongs to user
      const vehicle = await VehicleModel.findById(vehicle_id);
      if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
      }
      
      if (vehicle.user_id !== userId) {
        return res.status(403).json({ message: 'You do not have permission to book this vehicle' });
      }
      
      // Verify services exist
      if (!Array.isArray(service_ids) || service_ids.length === 0) {
        return res.status(400).json({ message: 'At least one service must be selected' });
      }
      
      // Calculate total price and get service details
      let totalPrice = 0;
      const serviceDetails = [];
      
      for (const serviceId of service_ids) {
        const service = await ServiceModel.findById(serviceId);
        if (!service) {
          return res.status(404).json({ message: `Service with ID ${serviceId} not found` });
        }
        totalPrice += service.price;
        serviceDetails.push(service);
      }
      
      // Parse scheduled time into start_time and end_time
      // Assuming scheduled_time is a single time slot like "10:00"
      // and services have duration_minutes that we can use to calculate end_time
      const start_time = scheduled_time;
      
      // Calculate total duration in minutes
      const totalDuration = serviceDetails.reduce((total, service) => total + service.duration_minutes, 0);
      
      // Calculate end time by adding total duration to start time
      const [startHours, startMinutes] = start_time.split(':').map(Number);
      const startTimeInMinutes = startHours * 60 + startMinutes;
      const endTimeInMinutes = startTimeInMinutes + totalDuration;
      
      const endHours = Math.floor(endTimeInMinutes / 60);
      const endMinutes = endTimeInMinutes % 60;
      const end_time = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
      
      // Create booking
      const bookingId = await BookingModel.create({
        user_id: userId,
        vehicle_id,
        booking_date: scheduled_date,
        start_time,
        end_time,
        total_price: totalPrice,
        notes: notes || null
      });
      
      // Add services to booking
      for (const service of serviceDetails) {
        await BookingModel.addService(bookingId, service.id, 1, service.price);
      }
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'insert',
        table_name: 'bookings',
        record_id: bookingId,
        old_values: null,
        new_values: {
          vehicle_id,
          booking_date: scheduled_date,
          start_time,
          end_time,
          service_ids,
          notes: notes || null
        },
        ip_address: req.ip,
        metadata: null
      });
      
      logger.info(`New booking created: ${bookingId} by user ${userId}`);
      
      return res.status(201).json({
        message: 'Booking created successfully',
        booking_id: bookingId
      });
    } catch (error) {
      return handleServerError(res, error, 'Error creating booking');
    }
  }
  
  /**
   * Update booking (user can only update pending bookings)
   */
  async updateBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const bookingId = parseInt(id);
      const userId = req.user?.id;
      const userRole = req.user?.role;
      
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      // Get current booking
      const booking = await BookingModel.findById(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      // Check if user has permission to update this booking
      if (userRole !== 'admin' && userRole !== 'staff' && booking.user_id !== userId) {
        return res.status(403).json({ message: 'You do not have permission to update this booking' });
      }
      
      // Regular users can only update pending bookings
      if (userRole !== 'admin' && userRole !== 'staff' && booking.status !== 'pending') {
        return res.status(403).json({ message: 'You can only update pending bookings' });
      }
      
      const { scheduled_date, scheduled_time, notes, status, staff_id, service_ids } = req.body;
      
      // Prepare update data
      const updateData: any = {};
      
      if (scheduled_date) updateData.booking_date = scheduled_date;
      if (scheduled_time) {
        updateData.start_time = scheduled_time;
        
        // Calculate end time if we have service_ids
        if (Array.isArray(service_ids) && service_ids.length > 0) {
          // Calculate total duration in minutes
          let totalDuration = 0;
          for (const serviceId of service_ids) {
            const service = await ServiceModel.findById(serviceId);
            if (service) {
              totalDuration += service.duration_minutes;
            }
          }
          
          // Calculate end time
          const [startHours, startMinutes] = scheduled_time.split(':').map(Number);
          const startTimeInMinutes = startHours * 60 + startMinutes;
          const endTimeInMinutes = startTimeInMinutes + totalDuration;
          
          const endHours = Math.floor(endTimeInMinutes / 60);
          const endMinutes = endTimeInMinutes % 60;
          updateData.end_time = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
        }
      }
      
      if (notes !== undefined) updateData.notes = notes;
      
      // Only admin/staff can update status and staff_id
      if ((userRole === 'admin' || userRole === 'staff') && status) {
        updateData.status = status;
      }
      
      if (userRole === 'admin' && staff_id) {
        updateData.staff_id = staff_id;
      }
      
      // Update booking
      await BookingModel.update(bookingId, updateData);
      
      // Update services if provided
      if (Array.isArray(service_ids) && service_ids.length > 0) {
        // Verify services exist
        let totalPrice = 0;
        const serviceDetails = [];
        
        for (const serviceId of service_ids) {
          const service = await ServiceModel.findById(serviceId);
          if (!service) {
            return res.status(404).json({ message: `Service with ID ${serviceId} not found` });
          }
          totalPrice += service.price;
          serviceDetails.push(service);
        }
        
        // First, remove all existing services
        const existingServices = await BookingModel.getBookingServices(bookingId);
        for (const service of existingServices) {
          await BookingModel.removeService(bookingId, service.service_id);
        }
        
        // Then add the new services
        for (const service of serviceDetails) {
          await BookingModel.addService(bookingId, service.id, 1, service.price);
        }
        
        // Update total price
        await BookingModel.update(bookingId, { total_price: totalPrice });
      }
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'update',
        table_name: 'bookings',
        record_id: bookingId,
        old_values: {
          booking_date: booking.booking_date,
          start_time: booking.start_time,
          end_time: booking.end_time,
          notes: booking.notes,
          status: booking.status
        },
        new_values: updateData,
        ip_address: req.ip,
        metadata: {
          services_updated: Array.isArray(service_ids),
          admin_action: userRole === 'admin' || userRole === 'staff'
        }
      });
      
      logger.info(`Booking updated: ${bookingId} by user ${userId}`);
      
      return res.status(200).json({
        message: 'Booking updated successfully'
      });
    } catch (error) {
      return handleServerError(res, error, 'Error updating booking');
    }
  }
  
  /**
   * Cancel booking (user can only cancel pending bookings)
   */
  async cancelBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const bookingId = parseInt(id);
      const userId = req.user?.id;
      const userRole = req.user?.role;
      
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      // Get current booking
      const booking = await BookingModel.findById(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      // Check if user has permission to cancel this booking
      if (userRole !== 'admin' && userRole !== 'staff' && booking.user_id !== userId) {
        return res.status(403).json({ message: 'You do not have permission to cancel this booking' });
      }
      
      // Regular users can only cancel pending bookings
      if (userRole !== 'admin' && userRole !== 'staff' && booking.status !== 'pending') {
        return res.status(403).json({ message: 'You can only cancel pending bookings' });
      }
      
      // Update booking status to cancelled
      await BookingModel.update(bookingId, { status: 'cancelled' });
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'update',
        table_name: 'bookings',
        record_id: bookingId,
        old_values: { status: booking.status },
        new_values: { status: 'cancelled' },
        ip_address: req.ip,
        metadata: {
          cancellation: true,
          admin_action: userRole === 'admin' || userRole === 'staff'
        }
      });
      
      logger.info(`Booking cancelled: ${bookingId} by user ${userId}`);
      
      return res.status(200).json({
        message: 'Booking cancelled successfully'
      });
    } catch (error) {
      return handleServerError(res, error, 'Error cancelling booking');
    }
  }
  
  /**
   * Delete booking (admin only)
   */
  async deleteBooking(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const bookingId = parseInt(id);
      const userId = req.user?.id;
      const userRole = req.user?.role;
      
      if (!userId || userRole !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized. Only admins can delete bookings' });
      }
      
      // Get current booking
      const booking = await BookingModel.findById(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      // Delete booking
      await BookingModel.delete(bookingId);
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'delete',
        table_name: 'bookings',
        record_id: bookingId,
        old_values: {
          user_id: booking.user_id,
          vehicle_id: booking.vehicle_id,
          booking_date: booking.booking_date,
          start_time: booking.start_time,
          end_time: booking.end_time,
          status: booking.status
        },
        new_values: null,
        ip_address: req.ip,
        metadata: { admin_action: true }
      });
      
      logger.info(`Booking deleted: ${bookingId} by admin ${userId}`);
      
      return res.status(200).json({
        message: 'Booking deleted successfully'
      });
    } catch (error) {
      return handleServerError(res, error, 'Error deleting booking');
    }
  }
  
  /**
   * Get available time slots for a specific date
   */
  async getAvailableTimeSlots(req: Request, res: Response) {
    try {
      const { date } = req.params;
      
      // Validate date format
      if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
      }
      
      // Define all possible time slots (e.g., 9:00 AM to 5:00 PM in 1-hour increments)
      const allTimeSlots = [
        '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
      ];
      
      // Get bookings for the specified date
      const result = await db.query(
        `SELECT start_time, end_time 
         FROM bookings 
         WHERE booking_date = $1 
         AND status NOT IN ('cancelled')`,
        [date]
      );
      
      // Filter out booked time slots
      const availableTimeSlots = allTimeSlots.filter(timeSlot => {
        // Check if this time slot overlaps with any booked slot
        return !result.rows.some((booking: any) => {
          const slotTime = new Date(`${date}T${timeSlot}`);
          const bookingStart = new Date(`${date}T${booking.start_time}`);
          const bookingEnd = new Date(`${date}T${booking.end_time}`);
          
          return slotTime >= bookingStart && slotTime < bookingEnd;
        });
      });
      
      return res.status(200).json({
        date,
        available_slots: availableTimeSlots
      });
    } catch (error) {
      return handleServerError(res, error, 'Error fetching available time slots');
    }
  }
  
  /**
   * Get booking statistics (admin/staff only)
   */
  async getBookingStats(req: Request, res: Response) {
    try {
      const userId = req.user?.id;
      const userRole = req.user?.role;
      
      if (!userId || (userRole !== 'admin' && userRole !== 'staff')) {
        return res.status(403).json({ message: 'Unauthorized. Only admins and staff can view booking statistics' });
      }
      
      // Get date range from query parameters
      const startDate = req.query.start_date as string;
      const endDate = req.query.end_date as string;
      
      // Get booking statistics
      const stats = await BookingModel.getStatistics(startDate, endDate);
      
      return res.status(200).json(stats);
    } catch (error) {
      return handleServerError(res, error, 'Error fetching booking statistics');
    }
  }
}

export default new BookingController(); 