import { Router, Request, Response } from 'express';
import db from '@/lib/db';

const router = Router();

// Get all services
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM services ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new service
router.post('/', async (req, res) => {
  try {
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

export const serviceRoutes = router; 