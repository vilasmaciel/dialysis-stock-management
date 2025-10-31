-- Añadir columna hospital_pickup a la tabla materials
-- Fecha: 2025-10-31
-- Descripción: Permite marcar materiales que se recogen en el hospital en lugar de pedirse al proveedor

ALTER TABLE materials 
ADD COLUMN hospital_pickup BOOLEAN NOT NULL DEFAULT false;

-- Añadir comentario descriptivo
COMMENT ON COLUMN materials.hospital_pickup IS 'Indica si el material se recoge en el hospital en lugar de pedirse al proveedor';

-- Verificar que se añadió correctamente
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'materials' AND column_name = 'hospital_pickup';

