/*
  # Create RPC functions for post interactions

  1. New Functions
    - `increment` - Increments a numeric column by a specified amount
    - `decrement_with_floor` - Decrements a numeric column with a minimum floor value
  
  2. Purpose
    - These functions allow atomic updates to counters like likes, comments, etc.
    - They prevent race conditions when multiple users interact with the same post
*/

-- Function to increment a numeric column
CREATE OR REPLACE FUNCTION increment(x int, row_id uuid, column_name text)
RETURNS void AS $$
DECLARE
  table_name text := 'posts';
  query text;
BEGIN
  query := format('UPDATE %I SET %I = %I + %L WHERE id = %L',
    table_name, column_name, column_name, x, row_id);
  EXECUTE query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to decrement a numeric column with a floor value
CREATE OR REPLACE FUNCTION decrement_with_floor(x int, row_id uuid, column_name text, floor int)
RETURNS void AS $$
DECLARE
  table_name text := 'posts';
  query text;
BEGIN
  query := format('UPDATE %I SET %I = GREATEST(%I - %L, %L) WHERE id = %L',
    table_name, column_name, column_name, x, floor, row_id);
  EXECUTE query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;