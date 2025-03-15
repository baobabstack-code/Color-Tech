import express from 'express';
import BookingController from '../controllers/BookingController';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequiredFields, validateDate, validateEnum } from '../utils/validation';
import { paginationMiddleware } from '../middleware/pagination';

const router = express.Router();

// Public routes
router.get('/available-slots/:date', BookingController.getAvailableTimeSlots);

// Client routes
router.get('/my-bookings', authenticate, paginationMiddleware, BookingController.getMyBookings);
router.post('/', 
  authenticate, 
  validateRequiredFields(['vehicle_id', 'service_ids', 'scheduled_date', 'scheduled_time']),
  validateDate('scheduled_date'),
  BookingController.createBooking
);
router.get('/:id', authenticate, BookingController.getBookingById);
router.put('/:id', 
  authenticate, 
  BookingController.updateBooking
);
router.put('/:id/cancel', authenticate, BookingController.cancelBooking);

// Admin routes
router.get('/', 
  authenticate, 
  authorize('admin', 'staff'), 
  paginationMiddleware,
  BookingController.getAllBookings
);
router.get('/stats', 
  authenticate, 
  authorize('admin', 'staff'), 
  BookingController.getBookingStats
);
router.put('/:id/status', 
  authenticate, 
  authorize('admin', 'staff'),
  validateRequiredFields(['status']),
  validateEnum('status', ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']),
  BookingController.updateBooking
);
router.delete('/:id', authenticate, authorize('admin'), BookingController.deleteBooking);

export default router; 