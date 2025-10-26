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
