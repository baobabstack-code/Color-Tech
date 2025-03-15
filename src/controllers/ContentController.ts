import { Request, Response } from 'express';
import ContentModel from '../models/Content';
import { handleServerError, createError } from '../utils/errorHandler';
import { getPaginationParams, addPaginationMetadata, paginatedResponse } from '../utils/pagination';
import logger from '../utils/logger';
import { createAuditLog } from '../utils/auditLogger';
import path from 'path';
import fs from 'fs';
import { deleteFile } from '../utils/fileUpload';

// Define a custom interface that extends Express Request to include file upload
interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

class ContentController {
  /**
   * Get all published content with pagination
   */
  async getAllPublishedContent(req: Request, res: Response) {
    try {
      const pagination = getPaginationParams(req);
      const type = req.query.type as string | undefined;
      
      const content = await ContentModel.findPublished(
        pagination.limit, 
        pagination.offset,
        type
      );
      
      const totalCount = await ContentModel.countPublished(type);
      
      const paginationMetadata = addPaginationMetadata(pagination, totalCount);
      
      return res.status(200).json(paginatedResponse(content, paginationMetadata));
    } catch (error) {
      logger.error('Error getting published content:', error);
      return handleServerError(res, error, 'Failed to retrieve content');
    }
  }

  /**
   * Get content by type with pagination
   */
  async getContentByType(req: Request, res: Response) {
    try {
      const { type } = req.params;
      const pagination = getPaginationParams(req);
      
      const content = await ContentModel.findByType(
        type,
        pagination.limit, 
        pagination.offset,
        true // published only for public routes
      );
      
      const totalCount = await ContentModel.countByType(type, true);
      
      const paginationMetadata = addPaginationMetadata(pagination, totalCount);
      
      return res.status(200).json(paginatedResponse(content, paginationMetadata));
    } catch (error) {
      logger.error(`Error getting content by type ${req.params.type}:`, error);
      return handleServerError(res, error, 'Failed to retrieve content');
    }
  }

  /**
   * Get content by ID
   */
  async getContentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const content = await ContentModel.findById(parseInt(id));
      
      if (!content) {
        return res.status(404).json({ message: 'Content not found' });
      }
      
      // For public routes, only return published content
      if (!content.is_published) {
        return res.status(404).json({ message: 'Content not found' });
      }
      
      return res.status(200).json({ content });
    } catch (error) {
      logger.error('Error getting content by ID:', error);
      return handleServerError(res, error, 'Failed to retrieve content');
    }
  }

  /**
   * Get all content (admin only)
   */
  async getAllContent(req: Request, res: Response) {
    try {
      const pagination = getPaginationParams(req);
      const type = req.query.type as string | undefined;
      const isPublished = req.query.is_published === 'true' ? true : 
                         req.query.is_published === 'false' ? false : undefined;
      
      const content = await ContentModel.findAll(
        pagination.limit, 
        pagination.offset,
        type,
        isPublished
      );
      
      const totalCount = await ContentModel.countAll(type, isPublished);
      
      const paginationMetadata = addPaginationMetadata(pagination, totalCount);
      
      return res.status(200).json(paginatedResponse(content, paginationMetadata));
    } catch (error) {
      logger.error('Error getting all content:', error);
      return handleServerError(res, error, 'Failed to retrieve content');
    }
  }

  /**
   * Create new content (admin only)
   */
  async createContent(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const contentData = {
        ...req.body,
        created_by: userId,
        updated_by: userId
      };
      
      const content = await ContentModel.create(contentData);
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'insert',
        table_name: 'content',
        record_id: content.id,
        new_values: contentData,
        ip_address: req.ip
      });
      
      return res.status(201).json({ 
        message: 'Content created successfully',
        content 
      });
    } catch (error) {
      logger.error('Error creating content:', error);
      return handleServerError(res, error, 'Failed to create content');
    }
  }

  /**
   * Update content (admin only)
   */
  async updateContent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Get the original content for audit logging
      const originalContent = await ContentModel.findById(parseInt(id));
      
      if (!originalContent) {
        return res.status(404).json({ message: 'Content not found' });
      }
      
      const contentData = {
        ...req.body,
        updated_by: userId,
        updated_at: new Date()
      };
      
      const updatedContent = await ContentModel.update(parseInt(id), contentData);
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'update',
        table_name: 'content',
        record_id: parseInt(id),
        old_values: originalContent,
        new_values: updatedContent,
        ip_address: req.ip
      });
      
      return res.status(200).json({ 
        message: 'Content updated successfully',
        content: updatedContent 
      });
    } catch (error) {
      logger.error('Error updating content:', error);
      return handleServerError(res, error, 'Failed to update content');
    }
  }

  /**
   * Publish content (admin only)
   */
  async publishContent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Get the original content for audit logging
      const originalContent = await ContentModel.findById(parseInt(id));
      
      if (!originalContent) {
        return res.status(404).json({ message: 'Content not found' });
      }
      
      const updatedContent = await ContentModel.updatePublishStatus(parseInt(id), true, userId);
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'update',
        table_name: 'content',
        record_id: parseInt(id),
        old_values: { is_published: originalContent.is_published },
        new_values: { is_published: true },
        ip_address: req.ip
      });
      
      return res.status(200).json({ 
        message: 'Content published successfully',
        content: updatedContent 
      });
    } catch (error) {
      logger.error('Error publishing content:', error);
      return handleServerError(res, error, 'Failed to publish content');
    }
  }

  /**
   * Unpublish content (admin only)
   */
  async unpublishContent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Get the original content for audit logging
      const originalContent = await ContentModel.findById(parseInt(id));
      
      if (!originalContent) {
        return res.status(404).json({ message: 'Content not found' });
      }
      
      const updatedContent = await ContentModel.updatePublishStatus(parseInt(id), false, userId);
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'update',
        table_name: 'content',
        record_id: parseInt(id),
        old_values: { is_published: originalContent.is_published },
        new_values: { is_published: false },
        ip_address: req.ip
      });
      
      return res.status(200).json({ 
        message: 'Content unpublished successfully',
        content: updatedContent 
      });
    } catch (error) {
      logger.error('Error unpublishing content:', error);
      return handleServerError(res, error, 'Failed to unpublish content');
    }
  }

  /**
   * Delete content (admin only)
   */
  async deleteContent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userId = (req as any).user.id;
      
      // Get the original content for audit logging
      const content = await ContentModel.findById(parseInt(id));
      
      if (!content) {
        return res.status(404).json({ message: 'Content not found' });
      }
      
      await ContentModel.delete(parseInt(id));
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'delete',
        table_name: 'content',
        record_id: parseInt(id),
        old_values: content,
        ip_address: req.ip
      });
      
      return res.status(200).json({ message: 'Content deleted successfully' });
    } catch (error) {
      logger.error('Error deleting content:', error);
      return handleServerError(res, error, 'Failed to delete content');
    }
  }

  /**
   * Upload gallery images (admin only)
   */
  async uploadGalleryImage(req: RequestWithFile, res: Response) {
    try {
      const userId = (req as any).user.id;
      
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      // Create gallery content entry
      const contentData = {
        title: req.body.title || req.file.originalname,
        type: 'gallery',
        content: JSON.stringify({
          file_path: req.file.path,
          original_name: req.file.originalname,
          mime_type: req.file.mimetype,
          size: req.file.size
        }),
        created_by: userId,
        updated_by: userId,
        is_published: req.body.is_published === 'true'
      };
      
      const content = await ContentModel.create(contentData);
      
      // Log the action
      await createAuditLog({
        user_id: userId,
        action: 'insert',
        table_name: 'content',
        record_id: content.id,
        new_values: contentData,
        ip_address: req.ip
      });
      
      return res.status(201).json({ 
        message: 'Gallery image uploaded successfully',
        content 
      });
    } catch (error) {
      logger.error('Error uploading gallery image:', error);
      return handleServerError(res, error, 'Failed to upload gallery image');
    }
  }

  /**
   * Get featured blog posts
   */
  async getFeaturedBlogPosts(req: Request, res: Response) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      
      const featuredPosts = await ContentModel.findFeaturedBlogPosts(limit);
      
      return res.status(200).json({ featuredPosts });
    } catch (error) {
      logger.error('Error getting featured blog posts:', error);
      return handleServerError(res, error, 'Failed to retrieve featured blog posts');
    }
  }

  /**
   * Get FAQ categories
   */
  async getFaqCategories(req: Request, res: Response) {
    try {
      const categories = await ContentModel.getFaqCategories();
      
      return res.status(200).json({ categories });
    } catch (error) {
      logger.error('Error getting FAQ categories:', error);
      return handleServerError(res, error, 'Failed to retrieve FAQ categories');
    }
  }
}

export default new ContentController(); 