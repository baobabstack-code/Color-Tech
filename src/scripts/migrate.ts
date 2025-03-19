import db from '../utils/db';
import logger from '../utils/logger';

async function migrate() {
  try {
    // Add last_login column
    await db.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
    `);

    // Update existing users to have a default last_login value
    await db.query(`
      UPDATE users SET last_login = created_at WHERE last_login IS NULL;
    `);

    logger.info('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate(); 