import { Pool, PoolClient, QueryResult } from 'pg';
import { config } from '../config';
import logger from './logger';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create a connection pool
const pool = new Pool({
  host: process.env.DB_HOST || config.db.host,
  user: process.env.DB_USER || config.db.user,
  password: process.env.DB_PASSWORD || config.db.password,
  database: process.env.DB_NAME || config.db.database,
  port: parseInt(process.env.DB_PORT || '5432'),
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000 // How long a client is allowed to remain idle before being closed
});

// Test the connection
pool.connect()
  .then((client) => {
    logger.info('Database connection established successfully');
    client.release();
  })
  .catch((err: Error) => {
    logger.error(`Error connecting to database: ${err.message}`);
  });

// Database utility functions
const db = {
  /**
   * Execute a query with parameters
   */
  query: async (sql: string, params: any[] = []): Promise<QueryResult> => {
    try {
      const result = await pool.query(sql, params);
      return result;
    } catch (error) {
      logger.error(`Database query error: ${error}`);
      throw error;
    }
  },
  
  /**
   * Begin a transaction
   */
  beginTransaction: async (): Promise<PoolClient> => {
    const client = await pool.connect();
    await client.query('BEGIN');
    return client;
  },
  
  /**
   * Commit a transaction
   */
  commit: async (client: PoolClient): Promise<void> => {
    await client.query('COMMIT');
    client.release();
  },
  
  /**
   * Rollback a transaction
   */
  rollback: async (client: PoolClient): Promise<void> => {
    await client.query('ROLLBACK');
    client.release();
  },
  
  /**
   * Close the pool
   */
  closePool: async (): Promise<void> => {
    try {
      await pool.end();
      logger.info('Database pool closed successfully');
    } catch (error) {
      logger.error(`Error closing database pool: ${error}`);
    }
  }
};

export default db; 