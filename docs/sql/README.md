# 📁 Scripts SQL - Orden de Ejecución

Estos archivos contienen todas las sentencias SQL para configurar la base de datos de Supabase.

## 🚀 Inicio Rápido

**¿Primera vez?** Usa el archivo **`00_full_schema.sql`** - contiene todo el esquema completo en un solo archivo.

**¿Quieres más control?** Ejecuta los archivos individualmente (01-14) en el orden especificado abajo.

## 🔢 Orden de Ejecución

Ejecuta los archivos en este orden en el **SQL Editor** de Supabase:

### 1️⃣ Extensiones y Tablas (01-05)
```
01_enable_uuid_extension.sql      # Habilita extensión UUID
02_create_materials_table.sql     # Tabla de materiales
03_create_inventory_logs_table.sql # Tabla de logs de inventario
04_create_orders_table.sql        # Tabla de pedidos
05_create_order_items_table.sql   # Tabla de items de pedidos
```

### 2️⃣ Índices y Funciones (06-09)
```
06_create_indexes.sql                      # Índices para mejor rendimiento
07_create_update_timestamp_function.sql    # Función para actualizar timestamps
08_create_update_trigger.sql              # Trigger para auto-actualizar updated_at
09_create_calculate_sessions_function.sql  # Función para calcular sesiones
```

### 3️⃣ Seguridad (10-14)
```
10_enable_rls.sql                    # Habilita Row Level Security
11_create_materials_policies.sql     # Políticas de acceso para materials
12_create_inventory_logs_policies.sql # Políticas de acceso para inventory_logs
13_create_orders_policies.sql        # Políticas de acceso para orders
14_create_order_items_policies.sql   # Políticas de acceso para order_items
```

## ⚡ Ejecución Rápida

### Opción 1: Script Completo (Más Rápido)

Si prefieres ejecutar todo de una vez:

1. Abre `00_full_schema.sql` - Este archivo contiene TODOS los scripts combinados
2. Copia todo su contenido
3. Pégalo en el SQL Editor de Supabase
4. Click en **Run**

### Opción 2: Archivo por Archivo (Más Control)

Ejecuta cada archivo individualmente (01-14) en orden para mejor control y debugging.

**Nota**: Es recomendable usar la Opción 2 si es tu primera vez, para verificar que no haya errores en cada paso.

## 📊 Verificación

Después de ejecutar todos los scripts, verifica que:

1. **Tablas creadas**:
   - Ve a **Table Editor** en Supabase
   - Deberías ver: `materials`, `inventory_logs`, `orders`, `order_items`

2. **RLS habilitado**:
   - En cada tabla, verifica que RLS esté habilitado (icono de escudo)

3. **Políticas creadas**:
   - En cada tabla, verifica que existan políticas de acceso

## 🔄 Próximo Paso

Después de ejecutar todos los scripts SQL, continúa con:
- `../YOUR_MATERIALS.sql` - Para insertar tus 23 materiales
