import express from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequiredFields, validateString, validateEnum } from '../utils/validation';
import { paginationMiddleware } from '../utils/pagination';
import ContentController from '../controllers/ContentController';

const router = express.Router();

// Public routes
router.get('/', paginationMiddleware(), ContentController.getAllPublishedContent);
router.get('/types/:type', paginationMiddleware(), ContentController.getContentByType);
router.get('/:id', ContentController.getContentById);

// Admin routes
router.get(
  '/all',
  authenticate,
  authorize('admin', 'staff'),
  paginationMiddleware(),
  ContentController.getAllContent
);

router.post(
  '/',
  authenticate,
  authorize('admin', 'staff'),
  validateRequiredFields(['title', 'content_type', 'body']),
  validateString('title', 1, 255),
  validateEnum('content_type', ['blog', 'gallery', 'testimonial', 'faq']),
  validateString('body', 1),
  ContentController.createContent
);

router.put(
  '/:id',
  authenticate,
  authorize('admin', 'staff'),
  validateString('title', 1, 255),
  validateEnum('content_type', ['blog', 'gallery', 'testimonial', 'faq']),
  validateString('body', 1),
  ContentController.updateContent
);

router.put(
  '/:id/publish',
  authenticate,
  authorize('admin'),
  ContentController.publishContent
);

router.put(
  '/:id/unpublish',
  authenticate,
  authorize('admin'),
  ContentController.unpublishContent
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  ContentController.deleteContent
);

// Gallery specific routes
router.post(
  '/gallery/upload',
  authenticate,
  authorize('admin', 'staff'),
  ContentController.uploadGalleryImage
);

// Blog specific routes
router.get('/blog/featured', ContentController.getFeaturedBlogPosts);

// FAQ specific routes
router.get('/faq/categories', ContentController.getFaqCategories);

export default router; 