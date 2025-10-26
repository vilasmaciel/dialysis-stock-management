-- Create order_items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES materials(id),
  code TEXT NOT NULL,
  uv TEXT, -- Presentación del proveedor
  description TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
