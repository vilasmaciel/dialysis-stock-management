-- Policies for inventory_logs (anyone authenticated can read and write)
CREATE POLICY "Authenticated users can view inventory logs"
  ON inventory_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert inventory logs"
  ON inventory_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);
