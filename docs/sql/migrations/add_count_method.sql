-- Añadir columna count_method a la tabla materials
-- Fecha: 2025-11-02
-- Descripción: Permite especificar el método de conteo durante la revisión de stock (unidades individuales o cajas sin abrir)

ALTER TABLE materials
ADD COLUMN count_method TEXT NOT NULL DEFAULT 'units' CHECK (count_method IN ('units', 'boxes'));

-- Añadir comentario descriptivo
COMMENT ON COLUMN materials.count_method IS 'Método de conteo para revisión de stock: "units" para unidades individuales, "boxes" para cajas sin abrir';

-- Verificar que se añadió correctamente
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'materials' AND column_name = 'count_method';
