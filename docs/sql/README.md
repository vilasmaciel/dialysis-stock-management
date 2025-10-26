# Database Setup - Dialysis Stock Management

Este directorio contiene los scripts SQL necesarios para configurar la base de datos en Supabase.

## Setup Inicial

### Opción 1: Setup Completo (Recomendado)

Ejecuta el archivo **`00_full_schema.sql`** que contiene todo el schema necesario:

1. Abre tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a **SQL Editor**
3. Abre el archivo `docs/sql/00_full_schema.sql`
4. Copia todo su contenido
5. Pégalo en el SQL Editor
6. Click en **Run**

Esto creará automáticamente:
- ✅ Tabla `settings` (configuración global)
- ✅ Tabla `materials` (catálogo de materiales)
- ✅ Tabla `inventory_logs` (historial de cambios)
- ✅ Tabla `orders` (pedidos)
- ✅ Tabla `order_items` (items de pedidos)
- ✅ Índices para mejor rendimiento
- ✅ Triggers para auto-actualizar timestamps
- ✅ Row Level Security (RLS) habilitado
- ✅ Políticas de acceso configuradas
- ✅ Datos iniciales (configuración por defecto)

## Verificación

Después de ejecutar el script, verifica que:

### Tablas Creadas
En **Table Editor** deberías ver:
- `settings`
- `materials`
- `inventory_logs`
- `orders`
- `order_items`

### Configuración Inicial
Verifica que existan estas configuraciones en `settings`:
```sql
SELECT * FROM settings;
```

Deberías ver:
- `inventory_sessions`: `{"min_sessions": 7, "max_sessions": 20}`
- `system`: `{"app_name": "Control de Material de Diálisis", "version": "2.0.0"}`

## Estructura del Schema

### Settings
Configuración global del sistema que aplica a todos los materiales:
- `min_sessions`: Sesiones mínimas de reserva
- `max_sessions`: Sesiones máximas a mantener

### Materials
Catálogo de materiales médicos con información de:
- Código proveedor
- Uso por sesión
- Stock actual
- Foto y notas

### Cálculos

Todos los cálculos (sesiones disponibles, cantidad a pedir) se realizan en el frontend de React, no en la base de datos.

## Siguiente Paso

Después de configurar el schema:
1. Inserta tus materiales usando `YOUR_MATERIALS.sql`
2. Configura las variables de entorno en `.env`
3. Inicia el servidor con `npm run dev`

## Notas

- **RLS está habilitado**: Solo usuarios autenticados pueden acceder
- **Configuración Global**: min/max sesiones se gestionan desde `settings` y aplican a todos los materiales
- **Cálculos en Frontend**: Todas las operaciones matemáticas (sesiones disponibles, cantidad a pedir) se realizan en React usando los datos de la BD
