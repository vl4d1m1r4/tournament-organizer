-- Add group_name and is_playoff columns to matches table
ALTER TABLE matches ADD COLUMN group_name TEXT;
ALTER TABLE matches ADD COLUMN is_playoff BOOLEAN DEFAULT false;