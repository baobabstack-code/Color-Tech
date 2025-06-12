import { Request, Response } from 'express';
import BookingController from '../../controllers/BookingController';
import BookingModel from '../../models/Booking';
import VehicleModel from '../../models/Vehicle';
import ServiceModel from '../../models/Service';
import { createAuditLog } from '../../utils/auditLogger';

// Mock dependencies
jest.mock('../../models/Booking');
jest.mock('../../models/Vehicle');
jest.mock('../../models/Service');
jest.mock('../../utils/auditLogger');

describe('BookingController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn().mockReturnThis();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    
    req = {
      user: { id: 1, email: 'test@example.com', role: 'client' },
      params: {},
      query: {},
      body: {},
      ip: '127.0.0.1',
    };
    
    res = {
      status: mockStatus,
      json: mockJson,
    };
    
    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('getAllBookings', () => {
    it('should return all bookings with pagination', async () => {
      // Setup
      const mockBookings = [{ id: 1, user_id: 1, vehicle_id: 1 }];
      const mockTotal = 1;
      
      req.query = { page: '1', limit: '10' };
      
      // @ts-ignore - Mock implementation
      BookingModel.findAll.mockResolvedValue(mockBookings);
      // @ts-ignore - Mock implementation
      BookingModel.countAll.mockResolvedValue(mockTotal);
      
      // Execute
      await BookingController.getAllBookings(req as Request, res as Response);
      
      // Assert
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        bookings: mockBookings,
        pagination: {
          total: mockTotal,
          page: 1,
          limit: 10,
          pages: 1
        }
      });
      expect(BookingModel.findAll).toHaveBeenCalled();
      expect(BookingModel.countAll).toHaveBeenCalled();
    });
  });

  describe('getMyBookings', () => {
    it('should return user bookings with pagination', async () => {
      // Setup
      const mockBookings = [{ id: 1, user_id: 1, vehicle_id: 1 }];
      const mockTotal = 1;
      
      req.query = { page: '1', limit: '10' };
      
      // @ts-ignore - Mock implementation
      BookingModel.findByUserId.mockResolvedValue(mockBookings);
      // @ts-ignore - Mock implementation
      BookingModel.countByUserId.mockResolvedValue(mockTotal);
      
      // Execute
      await BookingController.getMyBookings(req as Request, res as Response);
      
      // Assert
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        bookings: mockBookings,
        pagination: {
          total: mockTotal,
          page: 1,
          limit: 10,
          pages: 1
        }
      });
      expect(BookingModel.findByUserId).toHaveBeenCalledWith(1, 10, 0, undefined);
      expect(BookingModel.countByUserId).toHaveBeenCalledWith(1, undefined);
    });

    it('should return 401 if user is not authenticated', async () => {
      // Setup
      req.user = undefined;
      
      // Execute
      await BookingController.getMyBookings(req as Request, res as Response);
      
      // Assert
      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });
  });

  describe('createBooking', () => {
    it('should create a booking successfully', async () => {
      // Setup
      const bookingId = 123;
      const mockVehicle = { id: 1, user_id: 1, make: 'Toyota', model: 'Camry' };
      const mockService = { id: 1, name: 'Oil Change', price: 50 };
      
      req.body = {
        vehicle_id: 1,
        service_ids: [1],
        scheduled_date: '2023-06-01',
        scheduled_time: '10:00',
        notes: 'Test booking'
      };
      
      // @ts-ignore - Mock implementation
      VehicleModel.findById.mockResolvedValue(mockVehicle);
      // @ts-ignore - Mock implementation
      ServiceModel.findById.mockResolvedValue(mockService);
      // @ts-ignore - Mock implementation
      BookingModel.create.mockResolvedValue(bookingId);
      // @ts-ignore - Mock implementation
      BookingModel.addServices.mockResolvedValue(undefined);
      // @ts-ignore - Mock implementation
      createAuditLog.mockResolvedValue(undefined);
      
      // Execute
      await BookingController.createBooking(req as Request, res as Response);
      
      // Assert
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        message: 'Booking created successfully',
        booking_id: bookingId
      });
      expect(VehicleModel.findById).toHaveBeenCalledWith(1);
      expect(ServiceModel.findById).toHaveBeenCalledWith(1);
      expect(BookingModel.create).toHaveBeenCalled();
      expect(BookingModel.addService).toHaveBeenCalledWith(bookingId, [1]);
      expect(createAuditLog).toHaveBeenCalled();
    });

    it('should return 401 if user is not authenticated', async () => {
      // Setup
      req.user = undefined;
      
      // Execute
      await BookingController.createBooking(req as Request, res as Response);
      
      // Assert
      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Unauthorized' });
    });

    it('should return 404 if vehicle is not found', async () => {
      // Setup
      req.body = {
        vehicle_id: 999,
        service_ids: [1],
        scheduled_date: '2023-06-01',
        scheduled_time: '10:00'
      };
      
      // @ts-ignore - Mock implementation
      VehicleModel.findById.mockResolvedValue(null);
      
      // Execute
      await BookingController.createBooking(req as Request, res as Response);
      
      // Assert
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Vehicle not found' });
    });
  });

  describe('getBookingById', () => {
    it('should return a booking by ID', async () => {
      // Setup
      const mockBooking = { 
        id: 1, 
        user_id: 1, 
        vehicle_id: 1,
        status: 'pending'
      };
      
      req.params = { id: '1' };
      
      // @ts-ignore - Mock implementation
      BookingModel.findById.mockResolvedValue(mockBooking);
      
      // Execute
      await BookingController.getBookingById(req as Request, res as Response);
      
      // Assert
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockBooking);
      expect(BookingModel.findById).toHaveBeenCalledWith(1);
    });

    it('should return 404 if booking is not found', async () => {
      // Setup
      req.params = { id: '999' };
      
      // @ts-ignore - Mock implementation
      BookingModel.findById.mockResolvedValue(null);
      
      // Execute
      await BookingController.getBookingById(req as Request, res as Response);
      
      // Assert
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Booking not found' });
    });

    it('should return 403 if user does not have permission', async () => {
      // Setup
      const mockBooking = { 
        id: 1, 
        user_id: 2, // Different user ID
        vehicle_id: 1,
        status: 'pending'
      };
      
      req.params = { id: '1' };
      
      // @ts-ignore - Mock implementation
      BookingModel.findById.mockResolvedValue(mockBooking);
      
      // Execute
      await BookingController.getBookingById(req as Request, res as Response);
      
      // Assert
      expect(mockStatus).toHaveBeenCalledWith(403);
      expect(mockJson).toHaveBeenCalledWith({ 
        message: 'You do not have permission to view this booking' 
      });
    });
  });
}); 