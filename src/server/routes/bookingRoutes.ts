import { Router, Request, Response } from 'express';
import db from '@/lib/db';
import { auth, AuthRequest } from '../middleware/auth';

const router = Router();

interface CreateBookingRequest extends AuthRequest {
  body: {
    userId: string;
    vehicleId: string;
    serviceId: string;
    scheduledDate: string;
    scheduledTime: string;
    notes?: string;
  };
}

interface UpdateBookingRequest extends AuthRequest {
  body: {
    scheduledDate?: string;
    scheduledTime?: string;
    status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    notes?: string;
  };
}

// Get all bookings (admin only)
// @ts-ignore
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view all bookings' });
    }
    
    const result = await db.query(`
      SELECT b.*, u.full_name as client_name, s.name as service_name 
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN services s ON b.service_id = s.id
      ORDER BY b.scheduled_date DESC, b.scheduled_time DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get bookings for current user
// @ts-ignore
router.get('/my-bookings', auth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const result = await db.query(`
      SELECT b.*, s.name as service_name, s.description as service_description
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      WHERE b.user_id = $1
      ORDER BY b.scheduled_date DESC, b.scheduled_time DESC
    `, [userId]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get booking by ID
// @ts-ignore
router.get('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';
    
    // Build query based on user role
    let query = `
      SELECT b.*, u.full_name as client_name, s.name as service_name 
      FROM bookings b
      JOIN users u ON b.user_id = u.id
      JOIN services s ON b.service_id = s.id
      WHERE b.id = $1
    `;
    
    // For non-admin users, only allow access to their own bookings
    const queryParams = [id];
    if (!isAdmin) {
      query += ' AND b.user_id = $2';
      queryParams.push(userId as string);
    }
    
    const result = await db.query(query, queryParams);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new booking
// @ts-ignore
router.post('/', auth, async (req: CreateBookingRequest, res: Response) => {
  try {
    const { userId, vehicleId, serviceId, scheduledDate, scheduledTime, notes } = req.body;
    
    // Ensure the user can only create bookings for themselves unless they're an admin
    if (req.user?.role !== 'admin' && req.user?.id !== userId) {
      return res.status(403).json({ message: 'Not authorized to create bookings for other users' });
    }
    
    const result = await db.query(
      `INSERT INTO bookings (user_id, vehicle_id, service_id, scheduled_date, scheduled_time, notes, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'pending')
       RETURNING *`,
      [userId, vehicleId, serviceId, scheduledDate, scheduledTime, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking
// @ts-ignore
router.put('/:id', auth, async (req: UpdateBookingRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { scheduledDate, scheduledTime, status, notes } = req.body;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';
    
    // First, check if the booking exists and belongs to the user (if not admin)
    let bookingCheck;
    if (isAdmin) {
      bookingCheck = await db.query('SELECT * FROM bookings WHERE id = $1', [id]);
    } else {
      bookingCheck = await db.query('SELECT * FROM bookings WHERE id = $1 AND user_id = $2', [id, userId]);
    }
    
    if (bookingCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found or not authorized' });
    }
    
    // Restrict status updates for non-admin users
    if (!isAdmin && status && status !== 'cancelled') {
      return res.status(403).json({ message: 'Clients can only cancel bookings, not change status' });
    }
    
    // Build the update query dynamically based on provided fields
    const updates = [];
    const queryParams = [];
    let paramCounter = 1;
    
    if (scheduledDate) {
      updates.push(`scheduled_date = $${paramCounter++}`);
      queryParams.push(scheduledDate);
    }
    
    if (scheduledTime) {
      updates.push(`scheduled_time = $${paramCounter++}`);
      queryParams.push(scheduledTime);
    }
    
    if (status) {
      updates.push(`status = $${paramCounter++}`);
      queryParams.push(status);
    }
    
    if (notes) {
      updates.push(`notes = $${paramCounter++}`);
      queryParams.push(notes);
    }
    
    // Add updated_at timestamp
    updates.push(`updated_at = NOW()`);
    
    // If no fields to update, return the existing booking
    if (updates.length === 1) { // Only updated_at
      return res.json(bookingCheck.rows[0]);
    }
    
    // Add the booking ID as the last parameter
    queryParams.push(id);
    
    const result = await db.query(
      `UPDATE bookings SET ${updates.join(', ')} WHERE id = $${paramCounter} RETURNING *`,
      queryParams
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete booking
// @ts-ignore
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';
    
    // Check if booking exists and user has permission
    let bookingCheck;
    if (isAdmin) {
      bookingCheck = await db.query('SELECT * FROM bookings WHERE id = $1', [id]);
    } else {
      bookingCheck = await db.query('SELECT * FROM bookings WHERE id = $1 AND user_id = $2', [id, userId]);
    }
    
    if (bookingCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found or not authorized' });
    }
    
    // For non-admin users, only allow deletion of pending bookings
    if (!isAdmin && bookingCheck.rows[0].status !== 'pending') {
      return res.status(403).json({ 
        message: 'Cannot delete bookings that are already confirmed or in progress' 
      });
    }
    
    // Delete the booking
    await db.query('DELETE FROM bookings WHERE id = $1', [id]);
    
    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export const bookingRoutes = router; 