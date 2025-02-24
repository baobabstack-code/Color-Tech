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

// Get all bookings
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM bookings ORDER BY scheduled_date DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new booking
router.post('/', auth, async (req: CreateBookingRequest, res: Response) => {
  try {
    const { userId, vehicleId, serviceId, scheduledDate, scheduledTime, notes } = req.body;
    
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

export const bookingRoutes = router; 