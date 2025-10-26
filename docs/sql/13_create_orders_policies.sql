-- Policies for orders (anyone authenticated can read and write)
CREATE POLICY "Authenticated users can view orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true);
