-- Alter matches table to add a time column
ALTER TABLE matches ADD COLUMN time TIME;
-- Add location column to matches table
ALTER TABLE matches ADD COLUMN location TEXT;