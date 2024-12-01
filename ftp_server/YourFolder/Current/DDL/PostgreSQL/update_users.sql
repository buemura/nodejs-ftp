-- Add the username column as nullable, if it does not already exist.
ALTER TABLE users
ADD COLUMN IF NOT EXISTS fullname VARCHAR(50) NULL;

-- If the column already exists but you want to explicitly allow nulls:
ALTER TABLE users
ALTER COLUMN fullname DROP NOT NULL;
