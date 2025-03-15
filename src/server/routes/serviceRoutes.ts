import { Router, Request, Response } from 'express';
import db from '@/lib/db';
import { auth, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all services
// @ts-ignore
router.get('/', async (req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT * FROM services ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get service by ID
// @ts-ignore
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM services WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new service
// @ts-ignore
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to create services' });
    }
    
    const { name, description, basePrice, durationMinutes, category } = req.body;
    
    const result = await db.query(
      `INSERT INTO services (name, description, base_price, duration_minutes, category)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, description, basePrice, durationMinutes, category]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update service
// @ts-ignore
router.put('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update services' });
    }
    
    const { id } = req.params;
    const { name, description, basePrice, durationMinutes, category, status } = req.body;
    
    const result = await db.query(
      `UPDATE services 
       SET name = $1, description = $2, base_price = $3, 
           duration_minutes = $4, category = $5, status = $6, updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [name, description, basePrice, durationMinutes, category, status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete service
// @ts-ignore
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete services' });
    }
    
    const { id } = req.params;
    
    // Check if service exists
    const serviceCheck = await db.query('SELECT id FROM services WHERE id = $1', [id]);
    if (serviceCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    // Check if service is used in any bookings
    const bookingCheck = await db.query('SELECT id FROM bookings WHERE service_id = $1 LIMIT 1', [id]);
    if (bookingCheck.rows.length > 0) {
      // Instead of deleting, mark as inactive
      const result = await db.query(
        `UPDATE services SET status = 'inactive', updated_at = NOW() WHERE id = $1 RETURNING *`,
        [id]
      );
      return res.json({ message: 'Service marked as inactive (has associated bookings)', service: result.rows[0] });
    }
    
    // If no bookings, proceed with deletion
    await db.query('DELETE FROM services WHERE id = $1', [id]);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export const serviceRoutes = router; 