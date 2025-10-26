-- Full Schema v2.0 - Dialysis Stock Management
-- This is a complete, self-contained schema ready to execute in Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- SETTINGS TABLE - Global Configuration
-- ============================================================================
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- MATERIALS TABLE - Catalog of Medical Materials
-- ============================================================================
CREATE TABLE materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v7(),
  code TEXT NOT NULL UNIQUE, -- Provider code (e.g.: 483197)
  uv TEXT, -- Provider presentation (e.g.: C/2, C/24)
  name TEXT NOT NULL,
  description TEXT,
  unit TEXT NOT NULL, -- 'unidades', 'ml', 'cajas', 'bolsas', etc.
  usage_per_session DECIMAL NOT NULL, -- Quantity used per session
  current_stock DECIMAL NOT NULL DEFAULT 0,
  photo_url TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE materials IS 'Materials catalog. Session configuration (min/max) is stored globally in settings table. All calculations (sessions available, order quantity) are done in the React frontend.';

-- ============================================================================
-- INVENTORY LOGS TABLE - Stock Change History
-- ============================================================================
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

-- ============================================================================
-- ORDERS TABLE - Purchase Orders
-- ============================================================================
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

-- ============================================================================
-- ORDER ITEMS TABLE - Individual Order Lines
-- ============================================================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES materials(id),
  code TEXT NOT NULL,
  uv TEXT, -- Provider presentation
  description TEXT NOT NULL,
  quantity DECIMAL NOT NULL,
  unit TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_inventory_logs_material_id ON inventory_logs(material_id);
CREATE INDEX idx_inventory_logs_created_at ON inventory_logs(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger to auto-update updated_at on materials
CREATE TRIGGER update_materials_updated_at
  BEFORE UPDATE ON materials
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-update updated_at on settings
CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Settings Policies
CREATE POLICY "Authenticated users can view settings"
  ON settings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update settings"
  ON settings FOR UPDATE
  TO authenticated
  USING (true);

-- Materials Policies
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

-- Inventory Logs Policies
CREATE POLICY "Authenticated users can view inventory logs"
  ON inventory_logs FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert inventory logs"
  ON inventory_logs FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Orders Policies
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

-- Order Items Policies
CREATE POLICY "Authenticated users can view order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================================================
-- DEFAULT DATA
-- ============================================================================

-- Insert default configuration
INSERT INTO settings (key, value, description) VALUES
  ('inventory_sessions', '{"min_sessions": 7, "max_sessions": 20}'::jsonb, 'Configuración de sesiones mínimas y máximas de reserva para inventario'),
  ('system', '{"app_name": "Control de Material de Diálisis", "version": "2.0.0"}'::jsonb, 'Configuración general del sistema');
