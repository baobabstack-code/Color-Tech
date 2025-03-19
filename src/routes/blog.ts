import express from 'express';
import BlogController from '../controllers/BlogController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', BlogController.getBlogPosts);
router.get('/:id', BlogController.getBlogPost);

// Protected routes
router.post('/', authenticate, BlogController.createBlogPost);
router.put('/:id', authenticate, BlogController.updateBlogPost);
router.delete('/:id', authenticate, BlogController.deleteBlogPost);

export default router; 