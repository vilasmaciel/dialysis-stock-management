-- Policies for materials (anyone authenticated can read and write)
CREATE POLICY "Authenticated users can view materials"
  ON materials FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert materials"
  ON materials FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update materials"
  ON materials FOR UPDATE
  TO authenticated
  USING (true);
