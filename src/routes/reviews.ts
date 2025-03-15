import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequiredFields, validateNumber, validateString, validateEnum } from '../utils/validation';
import { paginationMiddleware } from '../utils/pagination';
import ReviewController from '../controllers/ReviewController';

const router = express.Router();

// Public routes
router.get('/', paginationMiddleware(), ReviewController.getPublicReviews);
router.get('/service/:serviceId', paginationMiddleware(), ReviewController.getReviewsByServiceId);

// Client routes
router.get('/my-reviews', authenticate, ReviewController.getMyReviews);
router.post(
  '/',
  authenticate,
  validateRequiredFields(['service_id', 'booking_id', 'rating', 'comment']),
  validateNumber('service_id', 1),
  validateNumber('booking_id', 1),
  validateNumber('rating', 1, 5),
  validateString('comment', 1, 1000),
  ReviewController.createReview
);
router.put(
  '/:id',
  authenticate,
  validateNumber('rating', 1, 5),
  validateString('comment', 1, 1000),
  ReviewController.updateReview
);
router.delete('/:id', authenticate, ReviewController.deleteReview);

// Admin routes
router.get(
  '/all',
  authenticate,
  authorize('admin', 'staff'),
  paginationMiddleware(),
  ReviewController.getAllReviews
);
router.put(
  '/:id/status',
  authenticate,
  authorize('admin', 'staff'),
  validateRequiredFields(['status']),
  validateEnum('status', ['pending', 'approved', 'rejected']),
  ReviewController.updateReviewStatus
);
router.delete(
  '/:id/admin',
  authenticate,
  authorize('admin'),
  ReviewController.adminDeleteReview
);

export default router; 