import { Request, Response } from 'express';
import ReviewModel from '../models/Review';
import { handleServerError, createError } from '../utils/errorHandler';
import { getPaginationParams, addPaginationMetadata, paginatedResponse } from '../utils/pagination';
import logger from '../utils/logger';
import { createAuditLog } from '../utils/auditLogger';

class ReviewController {
  /**
   * Get all public reviews with pagination
   */
  async getPublicReviews(req: Request, res: Response) {
    try {
      const pagination = getPaginationParams(req);
      
      const reviews = await ReviewModel.findPublic(
        pagination.limit, 
        pagination.offset
      );
      
      const totalCount = await ReviewModel.countPublic();
      
      const paginationMetadata = addPaginationMetadata(pagination, totalCount);
      
      return res.status(200).json(paginatedResponse(reviews, paginationMetadata));
    } catch (error) {
      logger.error('Error getting public reviews:', error);
      return handleServerError(res, error, 'Failed to retrieve reviews');
    }
  }

  /**
   * Get reviews by service ID with pagination
   */
  async getReviewsByServiceId(req: Request, res: Response) {
    try {
      const { serviceId } = req.params;
      const pagination = getPaginationParams(req);
      
      const reviews = await ReviewModel.findByServiceId(
        parseInt(serviceId),
        pagination.limit, 
        pagination.offset
      );
      
      const totalCount = await ReviewModel.countByServiceId(parseInt(serviceId));
      
      const paginationMetadata = addPaginationMetadata(pagination, totalCount);
      
      return res.status(200).json(paginatedResponse(reviews, paginationMetadata));
    } catch (error) {
      logger.error('Error getting reviews by service ID:', error);
      return handleServerError(res, error, 'Failed to retrieve reviews for this service');
    }
  }

  /**
   * Get reviews by the authenticated user
   */
  async getMyReviews(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const pagination = getPaginationParams(req);
      
      const reviews = await ReviewModel.findByUserId(
        userId,
        pagination.limit, 
        pagination.offset
      );
      
      const totalCount = await ReviewModel.countByUserId(userId);
      
      const paginationMetadata = addPaginationMetadata(pagination, totalCount);
      
      return res.status(200).json(paginatedResponse(reviews, paginationMetadata));
    } catch (error) {
      logger.error('Error getting user reviews:', error);
      return handleServerError(res, error, 'Failed to retrieve your reviews');
    }
  }

  /**
   * Get all reviews (admin only)
   */
  async getAllReviews(req: Request, res: Response) {
    try {
      const pagination = getPaginationParams(req);
      const status = req.query.status as string | undefined;
      
      const reviews = await ReviewModel.findAll(
        pagination.limit, 
        pagination.offset,
        status
      );
      
      const totalCount = await ReviewModel.countAll(status);
      
      const paginationMetadata = addPaginationMetadata(pagination, totalCount);
      
      return res.status(200).json(paginatedResponse(reviews, paginationMetadata));
    } catch (error) {
      logger.error('Error getting all reviews:', error);
      return handleServerError(res, error, 'Failed to retrieve reviews');
    }
  }

  /**
   * Create a new review
   */
  async createReview(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const reviewData = {
        ...req.body,
        user_id: userId,
        status: 'pending' // Default status for new reviews
      };
      
      const review = await ReviewModel.create(reviewData);
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'insert',
        table_name: 'reviews',
        record_id: review.id,
        new_values: reviewData,
        ip_address: req.ip
      });
      
      return res.status(201).json({ 
        message: 'Review submitted successfully and pending approval',
        review 
      });
    } catch (error) {
      logger.error('Error creating review:', error);
      return handleServerError(res, error, 'Failed to submit review');
    }
  }

  /**
   * Update a review (user can only update their own reviews)
   */
  async updateReview(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Get the original review for audit logging and ownership check
      const originalReview = await ReviewModel.findById(parseInt(id));
      
      if (!originalReview) {
        return res.status(404).json({ message: 'Review not found' });
      }
      
      // Check if the user owns this review
      if (originalReview.user_id !== userId) {
        return res.status(403).json({ message: 'You can only update your own reviews' });
      }
      
      // Reset status to pending if content is changed
      const reviewData = {
        ...req.body,
        status: 'pending' // Reset to pending on update
      };
      
      const updatedReview = await ReviewModel.update(parseInt(id), reviewData);
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'update',
        table_name: 'reviews',
        record_id: parseInt(id),
        old_values: originalReview,
        new_values: updatedReview,
        ip_address: req.ip
      });
      
      return res.status(200).json({ 
        message: 'Review updated successfully and pending approval',
        review: updatedReview 
      });
    } catch (error) {
      logger.error('Error updating review:', error);
      return handleServerError(res, error, 'Failed to update review');
    }
  }

  /**
   * Delete a review (user can only delete their own reviews)
   */
  async deleteReview(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Get the original review for audit logging and ownership check
      const review = await ReviewModel.findById(parseInt(id));
      
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
      
      // Check if the user owns this review
      if (review.user_id !== userId) {
        return res.status(403).json({ message: 'You can only delete your own reviews' });
      }
      
      await ReviewModel.delete(parseInt(id));
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'delete',
        table_name: 'reviews',
        record_id: parseInt(id),
        old_values: review,
        ip_address: req.ip
      });
      
      return res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
      logger.error('Error deleting review:', error);
      return handleServerError(res, error, 'Failed to delete review');
    }
  }

  /**
   * Update review status (admin only)
   */
  async updateReviewStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      const { status } = req.body;
      
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ 
          message: 'Invalid status. Status must be pending, approved, or rejected' 
        });
      }
      
      // Get the original review for audit logging
      const originalReview = await ReviewModel.findById(parseInt(id));
      
      if (!originalReview) {
        return res.status(404).json({ message: 'Review not found' });
      }
      
      const updatedReview = await ReviewModel.updateStatus(parseInt(id), status);
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'update',
        table_name: 'reviews',
        record_id: parseInt(id),
        old_values: { status: originalReview.status },
        new_values: { status },
        ip_address: req.ip
      });
      
      return res.status(200).json({ 
        message: `Review status updated to ${status}`,
        review: updatedReview 
      });
    } catch (error) {
      logger.error('Error updating review status:', error);
      return handleServerError(res, error, 'Failed to update review status');
    }
  }

  /**
   * Delete a review (admin only)
   */
  async adminDeleteReview(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Get the original review for audit logging
      const review = await ReviewModel.findById(parseInt(id));
      
      if (!review) {
        return res.status(404).json({ message: 'Review not found' });
      }
      
      await ReviewModel.delete(parseInt(id));
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'delete',
        table_name: 'reviews',
        record_id: parseInt(id),
        old_values: review,
        ip_address: req.ip,
        metadata: { admin_deletion: true, reason: 'Admin deletion' }
      });
      
      return res.status(200).json({ message: 'Review deleted successfully by admin' });
    } catch (error) {
      logger.error('Error admin deleting review:', error);
      return handleServerError(res, error, 'Failed to delete review');
    }
  }
}

export default new ReviewController(); 