-- Create inventory_logs table
CREATE TABLE inventory_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  previous_stock DECIMAL NOT NULL,
  new_stock DECIMAL NOT NULL,
  change DECIMAL NOT NULL,
  change_type TEXT NOT NULL CHECK (change_type IN ('manual', 'review', 'order', 'usage')),
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
