import { Router, Request, Response } from 'express';
import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '@/lib/db';
import { config } from '@/config';
import { auth, AuthRequest } from '../middleware/auth';

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

interface UpdateUserRequest extends AuthRequest {
  body: {
    fullName?: string;
    phone?: string;
    email?: string;
    password?: string;
    role?: 'client' | 'admin' | 'staff';
    status?: 'active' | 'inactive';
  };
}

// Get all users (admin only)
// @ts-ignore
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view all users' });
    }
    
    const result = await db.query(`
      SELECT id, email, full_name, phone, role, status, created_at, updated_at
      FROM users
      ORDER BY full_name
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user profile
// @ts-ignore
router.get('/me', auth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const result = await db.query(`
      SELECT id, email, full_name, phone, role, status, created_at, updated_at
      FROM users
      WHERE id = $1
    `, [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID (admin only)
// @ts-ignore
router.get('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view user details' });
    }
    
    const { id } = req.params;
    
    const result = await db.query(`
      SELECT id, email, full_name, phone, role, status, created_at, updated_at
      FROM users
      WHERE id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register new user
// @ts-ignore
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
      `INSERT INTO users (email, password, full_name, phone, role, status)
       VALUES ($1, $2, $3, $4, $5, 'active')
       RETURNING id, email, full_name, phone, role, status, created_at`,
      [email, hashedPassword, fullName, phone, role]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: result.rows[0].id, role },
      config.jwtSecret,
      { expiresIn: '7d' }
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

// Login user
// @ts-ignore
router.post('/login', async (req: LoginRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Check if user is active
    if (user.status === 'inactive') {
      return res.status(401).json({ message: 'Account is inactive' });
    }

    // Verify password
    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      config.jwtSecret,
      { expiresIn: '7d' }
    );

    // Return user info without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
// @ts-ignore
router.put('/me', auth, async (req: UpdateUserRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { fullName, phone, email, password } = req.body;
    
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    // Build the update query dynamically based on provided fields
    const updates = [];
    const queryParams = [];
    let paramCounter = 1;
    
    if (fullName) {
      updates.push(`full_name = $${paramCounter++}`);
      queryParams.push(fullName);
    }
    
    if (phone) {
      updates.push(`phone = $${paramCounter++}`);
      queryParams.push(phone);
    }
    
    if (email) {
      // Check if email is already in use by another user
      const emailCheck = await db.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, userId]
      );
      
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      updates.push(`email = $${paramCounter++}`);
      queryParams.push(email);
    }
    
    if (password) {
      const hashedPassword = await hash(password, 10);
      updates.push(`password = $${paramCounter++}`);
      queryParams.push(hashedPassword);
    }
    
    // Add updated_at timestamp
    updates.push(`updated_at = NOW()`);
    
    // If no fields to update, return early
    if (updates.length === 1) { // Only updated_at
      const currentUser = await db.query(
        'SELECT id, email, full_name, phone, role, status FROM users WHERE id = $1',
        [userId]
      );
      return res.json(currentUser.rows[0]);
    }
    
    // Add the user ID as the last parameter
    queryParams.push(userId);
    
    const result = await db.query(
      `UPDATE users 
       SET ${updates.join(', ')} 
       WHERE id = $${paramCounter}
       RETURNING id, email, full_name, phone, role, status, created_at, updated_at`,
      queryParams
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user (admin only)
// @ts-ignore
router.put('/:id', auth, async (req: UpdateUserRequest, res: Response) => {
  try {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update users' });
    }
    
    const { id } = req.params;
    const { fullName, phone, email, password, role, status } = req.body;
    
    // Check if user exists
    const userCheck = await db.query('SELECT id FROM users WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Build the update query dynamically based on provided fields
    const updates = [];
    const queryParams = [];
    let paramCounter = 1;
    
    if (fullName) {
      updates.push(`full_name = $${paramCounter++}`);
      queryParams.push(fullName);
    }
    
    if (phone) {
      updates.push(`phone = $${paramCounter++}`);
      queryParams.push(phone);
    }
    
    if (email) {
      // Check if email is already in use by another user
      const emailCheck = await db.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, id]
      );
      
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      updates.push(`email = $${paramCounter++}`);
      queryParams.push(email);
    }
    
    if (password) {
      const hashedPassword = await hash(password, 10);
      updates.push(`password = $${paramCounter++}`);
      queryParams.push(hashedPassword);
    }
    
    if (role) {
      if (!['client', 'admin', 'staff'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role specified' });
      }
      
      updates.push(`role = $${paramCounter++}`);
      queryParams.push(role);
    }
    
    if (status) {
      if (!['active', 'inactive'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status specified' });
      }
      
      updates.push(`status = $${paramCounter++}`);
      queryParams.push(status);
    }
    
    // Add updated_at timestamp
    updates.push(`updated_at = NOW()`);
    
    // If no fields to update, return early
    if (updates.length === 1) { // Only updated_at
      const currentUser = await db.query(
        'SELECT id, email, full_name, phone, role, status FROM users WHERE id = $1',
        [id]
      );
      return res.json(currentUser.rows[0]);
    }
    
    // Add the user ID as the last parameter
    queryParams.push(id);
    
    const result = await db.query(
      `UPDATE users 
       SET ${updates.join(', ')} 
       WHERE id = $${paramCounter}
       RETURNING id, email, full_name, phone, role, status, created_at, updated_at`,
      queryParams
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user (admin only)
// @ts-ignore
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is admin
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete users' });
    }
    
    const { id } = req.params;
    
    // Check if user exists
    const userCheck = await db.query('SELECT id FROM users WHERE id = $1', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user has associated bookings
    const bookingCheck = await db.query('SELECT id FROM bookings WHERE user_id = $1 LIMIT 1', [id]);
    if (bookingCheck.rows.length > 0) {
      // Instead of deleting, mark as inactive
      const result = await db.query(
        `UPDATE users SET status = 'inactive', updated_at = NOW() WHERE id = $1 RETURNING *`,
        [id]
      );
      return res.json({ 
        message: 'User marked as inactive (has associated bookings)', 
        user: result.rows[0] 
      });
    }
    
    // If no bookings, proceed with deletion
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export const userRoutes = router; 