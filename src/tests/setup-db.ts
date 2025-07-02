import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const setupTestDatabase = () => {
  const dbPath = path.resolve(process.cwd(), '.tmp', 'test.db');

  // Ensure the .tmp directory exists
  const tmpDir = path.dirname(dbPath);
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  // Delete the database file if it exists to ensure a clean state for each test run
  if (fs.existsSync(dbPath)) {
    fs.unlinkSync(dbPath);
  }

  const db = new Database(dbPath);
  db.exec('PRAGMA foreign_keys = ON;'); // Enable foreign key constraints

  const schemaPath = path.resolve(process.cwd(), 'database', 'migrations', 'create_test_schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  db.exec(schema);
  db.close();

  console.log('SQLite test database setup complete.');
};

export default setupTestDatabase;