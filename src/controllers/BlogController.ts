import { Request, Response } from 'express';
import logger from '../utils/logger';
import db from '../utils/db';

export const getBlogPosts = async (req: Request, res: Response) => {
  try {
    const result = await db.query(
      'SELECT * FROM blog_posts ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    logger.error('Error fetching blog posts:', error);
    res.status(500).json({ message: 'Error fetching blog posts' });
  }
};

export const getBlogPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'SELECT * FROM blog_posts WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error fetching blog post:', error);
    res.status(500).json({ message: 'Error fetching blog post' });
  }
};

export const createBlogPost = async (req: Request, res: Response) => {
  try {
    const { title, content, author_id } = req.body;
    const result = await db.query(
      'INSERT INTO blog_posts (title, content, author_id) VALUES ($1, $2, $3) RETURNING *',
      [title, content, author_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    logger.error('Error creating blog post:', error);
    res.status(500).json({ message: 'Error creating blog post' });
  }
};

export const updateBlogPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    const result = await db.query(
      'UPDATE blog_posts SET title = $1, content = $2, updated_at = NOW() WHERE id = $3 RETURNING *',
      [title, content, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    logger.error('Error updating blog post:', error);
    res.status(500).json({ message: 'Error updating blog post' });
  }
};

export const deleteBlogPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      'DELETE FROM blog_posts WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Blog post not found' });
    }
    
    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    logger.error('Error deleting blog post:', error);
    res.status(500).json({ message: 'Error deleting blog post' });
  }
};

// Default export for compatibility
export default {
  getBlogPosts,
  getBlogPost,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost
}; 