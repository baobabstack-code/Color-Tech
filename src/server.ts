import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { config } from './config';
import logger from './utils/logger';
import db from './utils/db';
import authRoutes from './routes/auth';
import bookingRoutes from './routes/bookings';
import vehicleRoutes from './routes/vehicles';
import serviceRoutes from './routes/services';
import reviewRoutes from './routes/reviews';
import contentRoutes from './routes/content';
import inventoryRoutes from './routes/inventory';
import { verifyJwtConfig } from './utils/verifyJwtConfig';

// Create Express app
const app = express();
const PORT = config.server.port;

// Middleware
app.use(cors({
  origin: config.cors.origin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log request information
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/inventory', inventoryRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', environment: config.server.env });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res, next) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  } else {
    next();
  }
});

// 404 handler
app.use((req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.url}`);
  res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Server error:', err);
  res.status(err.status || 500).json({
    message: 'Internal Server Error',
    error: config.server.env === 'development' ? err.message : undefined
  });
});

// Start server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT} in ${config.server.env} mode`);
  logger.info(`Database connected to ${config.db.host}:${config.db.port}/${config.db.database}`);
  
  // Verify JWT configuration
  try {
    const jwtVerification = verifyJwtConfig();
    if (jwtVerification.success) {
      logger.info('JWT configuration verified successfully');
    } else {
      logger.error(`JWT configuration verification failed: ${jwtVerification.message}`);
      logger.warn('Server started with invalid JWT configuration - authentication may not work correctly');
    }
  } catch (error) {
    logger.error('Error verifying JWT configuration:', error);
    logger.warn('Server started with potentially invalid JWT configuration - authentication may not work correctly');
  }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(async () => {
    logger.info('HTTP server closed');
    await db.closePool();
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  server.close(async () => {
    logger.info('HTTP server closed');
    await db.closePool();
    process.exit(0);
  });
});

export default app; 