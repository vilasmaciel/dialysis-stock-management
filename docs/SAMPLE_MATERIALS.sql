-- ============================================================================
-- MATERIALES DE DIÁLISIS - EJEMPLO
-- ============================================================================
-- Este archivo contiene ejemplos de materiales comunes para diálisis domiciliaria
-- Modifica los valores según tus necesidades específicas

-- ============================================================================
-- LIMPIEZA (Opcional - Solo si quieres empezar de cero)
-- ============================================================================
-- DELETE FROM order_items;
-- DELETE FROM orders;
-- DELETE FROM inventory_logs;
-- DELETE FROM materials;

-- ============================================================================
-- MATERIALES PRINCIPALES
-- ============================================================================

INSERT INTO materials (
  code,
  name,
  description,
  unit,
  usage_per_session,
  current_stock,
  photo_url,
  min_sessions,
  max_sessions,
  order_quantity,
  notes
) VALUES

-- DIALIZADORES
(
  'DIA-001',
  'Dializador FX80',
  'Dializador de alto flujo para hemodiálisis',
  'unidades',
  1,              -- 1 dializador por sesión
  15,             -- Stock actual: 15 unidades
  null,           -- URL de foto (opcional)
  7,              -- Mínimo: 7 sesiones
  20,             -- Máximo: 20 sesiones
  14,             -- Cantidad a pedir cuando esté bajo
  'Verificar fecha de caducidad'
),

-- LÍNEAS Y CONEXIONES
(
  'DIA-002',
  'Línea arterial',
  'Línea arterial para circuito de hemodiálisis',
  'unidades',
  1,
  20,
  null,
  7,
  20,
  14,
  'Uso único, desechar después de cada sesión'
),
(
  'DIA-003',
  'Línea venosa',
  'Línea venosa para circuito de hemodiálisis',
  'unidades',
  1,
  18,
  null,
  7,
  20,
  14,
  'Uso único, desechar después de cada sesión'
),
(
  'DIA-004',
  'Línea de bicarbonato',
  'Línea para conexión de bicarbonato',
  'unidades',
  1,
  12,
  null,
  7,
  20,
  14,
  null
),

-- SOLUCIONES Y CONCENTRADOS
(
  'DIA-005',
  'Bicarbonato bolsa 5L',
  'Solución de bicarbonato para diálisis',
  'bolsas',
  1,              -- 1 bolsa por sesión
  25,             -- Stock actual
  null,
  7,
  20,
  14,
  'Conservar en lugar fresco y seco'
),
(
  'DIA-006',
  'Concentrado ácido 5L',
  'Concentrado ácido parte A',
  'bidones',
  1,
  8,
  null,
  7,
  20,
  7,
  'Mantener alejado de la luz directa'
),
(
  'DIA-007',
  'Suero fisiológico 500ml',
  'Solución salina 0.9% para cebado',
  'bolsas',
  2,              -- 2 bolsas por sesión
  30,
  null,
  7,
  20,
  28,
  'Verificar que no tenga partículas'
),

-- AGUJAS Y MATERIAL ESTÉRIL
(
  'DIA-008',
  'Agujas AVF 15G',
  'Agujas para fístula arteriovenosa',
  'pares',
  2,              -- 2 agujas (1 par) por sesión
  30,
  null,
  7,
  20,
  28,
  'Manipular con técnica estéril'
),
(
  'DIA-009',
  'Gasas estériles 10x10',
  'Gasas estériles para punción',
  'paquetes',
  1,
  10,
  null,
  7,
  20,
  14,
  'Mantener en envase cerrado hasta su uso'
),
(
  'DIA-010',
  'Apósitos transparentes',
  'Apósito adhesivo transparente',
  'unidades',
  2,              -- 2 apósitos por sesión
  40,
  null,
  7,
  20,
  28,
  null
),

-- ANTISÉPTICOS Y DESINFECCIÓN
(
  'DIA-011',
  'Alcohol 70% 250ml',
  'Alcohol isopropílico para desinfección',
  'frascos',
  0.1,            -- Se usa un poco por sesión (100ml aprox)
  3,              -- Stock actual: 3 frascos
  null,
  7,
  20,
  2,
  'No caducar. Mantener bien cerrado'
),
(
  'DIA-012',
  'Clorhexidina 2% 250ml',
  'Antiséptico para desinfección de piel',
  'frascos',
  0.1,
  2,
  null,
  7,
  20,
  2,
  'Evitar contacto con mucosas'
),

-- PROTECCIÓN PERSONAL
(
  'DIA-013',
  'Guantes estériles talla M',
  'Guantes quirúrgicos estériles',
  'pares',
  2,
  40,
  null,
  7,
  20,
  28,
  'Verificar integridad antes de usar'
),
(
  'DIA-014',
  'Mascarillas quirúrgicas',
  'Mascarilla de protección de 3 capas',
  'cajas',
  0.1,            -- 1 caja dura varias sesiones
  3,
  null,
  7,
  20,
  2,
  'Uso obligatorio durante la sesión'
),

-- MATERIAL COMPLEMENTARIO
(
  'DIA-015',
  'Esparadrapo hipoalergénico',
  'Esparadrapo de papel hipoalergénico',
  'rollos',
  0.2,            -- Un rollo dura varias sesiones
  5,
  null,
  7,
  20,
  3,
  null
),
(
  'DIA-016',
  'Jeringuillas 10ml',
  'Jeringuillas desechables estériles',
  'unidades',
  2,
  50,
  null,
  7,
  20,
  28,
  'Verificar fecha de caducidad'
),
(
  'DIA-017',
  'Contenedor residuos biológicos',
  'Contenedor rígido para material punzante',
  'unidades',
  0.1,            -- Se cambia cada varias sesiones
  2,
  null,
  3,
  5,
  1,
  'Desechar cuando esté 3/4 lleno'
),
(
  'DIA-018',
  'Bolsas de residuos biosanitarios',
  'Bolsas rojas para residuos biológicos',
  'rollos',
  0.2,
  3,
  null,
  7,
  20,
  2,
  'Cerrar bien después de cada sesión'
);

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================
-- Ejecuta esta query para verificar que se insertaron correctamente:
SELECT
  code,
  name,
  current_stock,
  unit,
  usage_per_session,
  FLOOR(current_stock / usage_per_session) as sessions_available,
  CASE
    WHEN FLOOR(current_stock / usage_per_session) >= min_sessions
    THEN '🟢 OK'
    ELSE '🔴 BAJO'
  END as status
FROM materials
ORDER BY code;

-- ============================================================================
-- NOTAS IMPORTANTES
-- ============================================================================
-- 1. Modifica los valores de 'current_stock' según tu inventario real
-- 2. Ajusta 'usage_per_session' si usas cantidades diferentes
-- 3. Cambia 'min_sessions' y 'max_sessions' según tus necesidades
-- 4. Agrega o elimina materiales según tu caso específico
-- 5. Puedes agregar fotos posteriormente subiendo imágenes a Supabase Storage
