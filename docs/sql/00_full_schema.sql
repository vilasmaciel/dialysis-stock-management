-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Create materials table
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  code TEXT NOT NULL UNIQUE, -- Código del proveedor (ej: 483197)
  uv TEXT, -- Presentación del proveedor (ej: C/2, C/24)
  name TEXT NOT NULL,
  description TEXT,
  unit TEXT NOT NULL, -- 'unidades', 'ml', 'cajas', 'bolsas', etc.
  usage_per_session DECIMAL NOT NULL, -- Cantidad usada por sesión
  current_stock DECIMAL NOT NULL DEFAULT 0,
  photo_url TEXT,
  min_sessions INTEGER NOT NULL DEFAULT 7, -- Sesiones mínimas de reserva
  max_sessions INTEGER NOT NULL DEFAULT 20, -- Sesiones máximas
  order_quantity DECIMAL NOT NULL, -- Cantidad a pedir cuando está bajo
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
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
-- Create orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'completed')),
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE
);
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
-- Create indexes for better performance
CREATE INDEX idx_inventory_logs_material_id ON inventory_logs(material_id);
CREATE INDEX idx_inventory_logs_created_at ON inventory_logs(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Create trigger to auto-update updated_at
CREATE TRIGGER update_materials_updated_at
  BEFORE UPDATE ON materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
-- Create function to calculate available sessions
CREATE OR REPLACE FUNCTION calculate_available_sessions(
  stock DECIMAL,
  usage_per_session DECIMAL
)
RETURNS INTEGER AS $$
BEGIN
  IF usage_per_session = 0 THEN
    RETURN 9999; -- Si no se usa, consideramos infinito
  END IF;
  RETURN FLOOR(stock / usage_per_session)::INTEGER;
END;
$$ LANGUAGE plpgsql IMMUTABLE;
-- Enable RLS on all tables
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
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
-- Policies for inventory_logs (anyone authenticated can read and write)
CREATE POLICY "Authenticated users can view inventory logs"
  ON inventory_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert inventory logs"
  ON inventory_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);
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
-- Policies for order_items (anyone authenticated can read and write)
CREATE POLICY "Authenticated users can view order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (true);
