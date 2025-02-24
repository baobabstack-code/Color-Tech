import { Router, Request, Response } from 'express';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';
import { config } from '@/config';

const router = Router();

interface RegisterRequest extends Request {
  body: {
    email: string;
    password: string;
    fullName: string;
    phone: string;
    role: 'client' | 'admin';
  };
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

// Register new user
router.post('/register', async (req: RegisterRequest, res: Response) => {
  try {
    const { email, password, fullName, phone, role } = req.body;
    
    // Validate role
    if (!['client', 'admin'].includes(role)) {
      res.status(400).json({ message: 'Invalid role specified' });
      return;
    }
    
    // Check if user exists
    const userExists = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Create user
    const result = await db.query(
      `INSERT INTO users (email, password_hash, full_name, phone, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, full_name, role`,
      [email, hashedPassword, fullName, phone, role]
    );

    // Generate JWT
    const token = jwt.sign(
      { userId: result.rows[0].id },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      user: result.rows[0],
      token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req: LoginRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const user = result.rows[0];

    // Check password
    const validPassword = await compare(password, user.password_hash);
    if (!validPassword) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      config.jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export const userRoutes = router; 