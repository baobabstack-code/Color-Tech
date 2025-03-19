-- Add last_login column to users table
ALTER TABLE users ADD COLUMN last_login TIMESTAMP;

-- Update existing users to have a default last_login value
UPDATE users SET last_login = created_at WHERE last_login IS NULL; 