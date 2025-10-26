-- ============================================================================
-- TUS MATERIALES DE DIÁLISIS
-- ============================================================================
-- Generado automáticamente desde tu CSV
-- IMPORTANTE: Actualiza los valores de 'current_stock' con tu inventario real
-- IMPORTANTE: Ajusta 'usage_per_session' según tus necesidades

-- ============================================================================
-- MATERIALES
-- ============================================================================

INSERT INTO materials (
  code,
  uv,
  name,
  unit,
  usage_per_session,
  current_stock,
  min_sessions,
  max_sessions,
  order_quantity
) VALUES

('483197', 'C/2', 'Solución diálisis bicarbonato 35B/1,5K', 'bolsas', 1, 0, 7, 20, 14),
('483199', 'C/24', 'Líneas AV S3', 'unidades', 1, 0, 7, 20, 14),
('483201', 'C/6', 'Casete ERGO', 'unidades', 1, 0, 7, 20, 14),
('518484', 'C/20', 'Dializador Purifier 200H', 'unidades', 1, 0, 7, 20, 14),
('483176', 'C/5', 'Salina fisiológica 0,9% 2 litros L/L', 'bolsas', 1, 0, 7, 20, 14),
('483202', 'C/50', 'Línea drenaje', 'unidades', 1, 0, 7, 20, 14),
('496901', 'C/1', 'Mesa plateada Physidia 90', 'unidades', 0, 1, 1, 2, 1),
('513802', 'C/100', 'Jeringa 3C 5ml Luer', 'unidades', 2, 0, 7, 20, 28),
('513803', 'C/100', 'Jeringa 3C 10ml Luer', 'unidades', 2, 0, 7, 20, 28),
('513804', 'C/50', 'Jeringa 3C 20ml Luer', 'unidades', 1, 0, 7, 20, 14),
('503953', 'C/750', 'Gasas estériles', 'paquetes', 1, 0, 7, 20, 14),
('505642', 'C/25', 'Talla estéril (Paños estériles)', 'unidades', 1, 0, 7, 20, 14),
('534799', 'C/50', 'Mascarilla 3PLY', 'unidades', 1, 0, 7, 20, 14),
('445929', 'C/25', 'Saco protección catéter', 'unidades', 1, 0, 7, 20, 14),
('513985', 'C/100', 'Conector suero ICU (Tapones suero)', 'unidades', 2, 0, 7, 20, 28),
('506105', 'C/100', 'Tapón catéter desechable (Tapones rojos)', 'unidades', 2, 0, 7, 20, 28),
('435883', 'C/50', 'Guante estéril s/ polvo talla S', 'pares', 2, 0, 7, 20, 28),
('435884', 'C/50', 'Guante estéril s/ polvo talla M', 'pares', 2, 0, 7, 20, 28),
('435885', 'C/50', 'Guante estéril s/ polvo talla L', 'pares', 2, 0, 7, 20, 28),
('490611', 'C/1', 'Clorhexidina acuosa', 'frascos', 0.1, 0, 7, 20, 2),
('490717', 'C/1', 'Sterilium', 'frascos', 0.1, 0, 7, 20, 2),
('513221', 'C/12', 'Esparadrapo papel OperTape', 'rollos', 0.2, 0, 7, 20, 3);

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================
SELECT
  code,
  uv as presentacion,
  name,
  current_stock,
  unit,
  usage_per_session,
  CASE
    WHEN usage_per_session = 0 THEN 9999
    ELSE FLOOR(current_stock / usage_per_session)
  END as sessions_available,
  CASE
    WHEN usage_per_session = 0 THEN '⚪ EQUIPO'
    WHEN FLOOR(current_stock / NULLIF(usage_per_session, 0)) >= min_sessions THEN '🟢 OK'
    ELSE '🔴 BAJO'
  END as status
FROM materials
ORDER BY code;

-- ============================================================================
-- ACTUALIZAR STOCK (Ejemplo)
-- ============================================================================
-- Después de insertar, actualiza el stock con tus cantidades reales:
-- UPDATE materials SET current_stock = 10 WHERE code = '483197';
-- UPDATE materials SET current_stock = 20 WHERE code = '483199';
-- etc...

-- O mejor aún: Usa el "Modo Revisión" en la aplicación para actualizar
-- todos los stocks de forma guiada e intuitiva.
