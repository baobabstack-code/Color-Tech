import { Router, Request, Response } from 'express';
import db from '@/lib/db';
import { auth, AuthRequest } from '../middleware/auth';

const router = Router();

interface CreateReviewRequest extends AuthRequest {
  body: {
    serviceId: string;
    rating: number;
    comment: string;
  };
}

interface UpdateReviewRequest extends AuthRequest {
  body: {
    rating?: number;
    comment?: string;
    status?: 'pending' | 'approved' | 'rejected';
  };
}

// Get all reviews (admin only)
// @ts-ignore
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view all reviews' });
    }
    
    const result = await db.query(`
      SELECT r.*, u.full_name as user_name, s.name as service_name 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN services s ON r.service_id = s.id
      ORDER BY r.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get reviews for current user
// @ts-ignore
router.get('/my-reviews', auth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const result = await db.query(`
      SELECT r.*, s.name as service_name
      FROM reviews r
      JOIN services s ON r.service_id = s.id
      WHERE r.user_id = $1
      ORDER BY r.created_at DESC
    `, [userId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get review by ID
// @ts-ignore
router.get('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';
    
    // Build query based on user role
    let query = `
      SELECT r.*, u.full_name as user_name, s.name as service_name 
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      JOIN services s ON r.service_id = s.id
      WHERE r.id = $1
    `;
    
    // For non-admin users, only allow access to their own reviews
    const queryParams = [id];
    if (!isAdmin) {
      query += ' AND r.user_id = $2';
      queryParams.push(userId as string);
    }
    
    const result = await db.query(query, queryParams);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new review
// @ts-ignore
router.post('/', auth, async (req: CreateReviewRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { serviceId, rating, comment } = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    // Check if user has already reviewed this service
    const existingReview = await db.query(
      'SELECT id FROM reviews WHERE user_id = $1 AND service_id = $2',
      [userId, serviceId]
    );
    
    if (existingReview.rows.length > 0) {
      return res.status(400).json({ 
        message: 'You have already reviewed this service. Please update your existing review instead.' 
      });
    }
    
    // Check if the user has actually booked this service
    const bookingCheck = await db.query(
      'SELECT id FROM bookings WHERE user_id = $1 AND service_id = $2 AND status = $3 LIMIT 1',
      [userId, serviceId, 'completed']
    );
    
    if (bookingCheck.rows.length === 0) {
      return res.status(400).json({ 
        message: 'You can only review services that you have used and completed.' 
      });
    }
    
    const result = await db.query(
      `INSERT INTO reviews (user_id, service_id, rating, comment, date, status)
       VALUES ($1, $2, $3, $4, NOW(), 'pending')
       RETURNING *`,
      [userId, serviceId, rating, comment]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update review
// @ts-ignore
router.put('/:id', auth, async (req: UpdateReviewRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment, status } = req.body;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';
    
    // First, check if the review exists and belongs to the user (if not admin)
    let reviewCheck;
    if (isAdmin) {
      reviewCheck = await db.query('SELECT * FROM reviews WHERE id = $1', [id]);
    } else {
      reviewCheck = await db.query('SELECT * FROM reviews WHERE id = $1 AND user_id = $2', [id, userId]);
    }
    
    if (reviewCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Review not found or not authorized' });
    }
    
    // Restrict status updates for non-admin users
    if (!isAdmin && status) {
      return res.status(403).json({ message: 'Only admins can change review status' });
    }
    
    // Build the update query dynamically based on provided fields
    const updates = [];
    const queryParams = [];
    let paramCounter = 1;
    
    if (rating) {
      updates.push(`rating = $${paramCounter++}`);
      queryParams.push(rating);
    }
    
    if (comment) {
      updates.push(`comment = $${paramCounter++}`);
      queryParams.push(comment);
    }
    
    if (status && isAdmin) {
      updates.push(`status = $${paramCounter++}`);
      queryParams.push(status);
    }
    
    // Add updated_at timestamp
    updates.push(`updated_at = NOW()`);
    
    // If no fields to update, return the existing review
    if (updates.length === 1) { // Only updated_at
      return res.json(reviewCheck.rows[0]);
    }
    
    // Add the review ID as the last parameter
    queryParams.push(id);
    
    const result = await db.query(
      `UPDATE reviews SET ${updates.join(', ')} WHERE id = $${paramCounter} RETURNING *`,
      queryParams
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete review
// @ts-ignore
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';
    
    // Check if review exists and user has permission
    let reviewCheck;
    if (isAdmin) {
      reviewCheck = await db.query('SELECT * FROM reviews WHERE id = $1', [id]);
    } else {
      reviewCheck = await db.query('SELECT * FROM reviews WHERE id = $1 AND user_id = $2', [id, userId]);
    }
    
    if (reviewCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Review not found or not authorized' });
    }
    
    // Delete the review
    await db.query('DELETE FROM reviews WHERE id = $1', [id]);
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export const reviewRoutes = router; 