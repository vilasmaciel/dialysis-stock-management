-- Migration: Add DELETE policy for materials table
-- This allows authenticated users to delete materials that don't have order history

-- Add DELETE policy for materials
CREATE POLICY "Authenticated users can delete materials"
  ON materials FOR DELETE
  TO authenticated
  USING (true);
