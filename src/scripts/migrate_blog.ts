import db from '../utils/db';
import logger from '../utils/logger';
import fs from 'fs';
import path from 'path';

async function migrateBlogPosts() {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, '../../database/migrations/create_blog_posts_table.sql'),
      'utf8'
    );

    await db.query(sql);
    logger.info('Blog posts table migration completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Blog posts table migration failed:', error);
    process.exit(1);
  }
}

migrateBlogPosts(); 