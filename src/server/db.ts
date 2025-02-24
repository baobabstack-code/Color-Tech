import { Pool } from 'pg';
import { serverConfig } from './config';

const pool = new Pool({
  user: 'postgres',
  password: 'nyashaushe2399',
  host: 'localhost',
  port: 5432,
  database: 'color_tech_db',
  ssl: false
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

export default pool; 