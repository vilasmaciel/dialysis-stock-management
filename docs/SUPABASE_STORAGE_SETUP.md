# Configuración de Supabase Storage para Imágenes de Materiales

## Paso 1: Verificar o crear el bucket

1. Abre tu proyecto en [Supabase Dashboard](https://supabase.com/dashboard)
2. Ve a **Storage** en el menú lateral
3. Verifica si existe el bucket `material`. Si no existe, créalo:
   - Click en **New bucket**
   - Nombre: `material`
   - Público: **✅ Activado** (para que las URLs funcionen sin autenticación)
   - Click en **Create bucket**

## Paso 2: Configurar políticas de seguridad (RLS)

Para permitir que los usuarios autenticados suban imágenes, necesitas configurar las políticas de Row Level Security (RLS) en el bucket.

1. Ve a **Storage** > **Policies**
2. Selecciona el bucket `material`
3. Ejecuta los siguientes comandos SQL en **SQL Editor**:

### Políticas necesarias

```sql
-- Permitir INSERT a usuarios autenticados
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'material');

-- Permitir UPDATE a usuarios autenticados
CREATE POLICY "Authenticated users can update images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'material');

-- Permitir DELETE a usuarios autenticados
CREATE POLICY "Authenticated users can delete images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'material');

-- Permitir SELECT público (para mostrar imágenes)
CREATE POLICY "Public can view images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'material');
```

## Paso 3: Verificar la configuración

1. En **Storage** > **material**, intenta subir una imagen manualmente para verificar que funciona
2. Copia la URL pública de la imagen y verifica que se puede acceder sin autenticación

## Uso en la aplicación

Una vez configurado:

- **Al crear material**: Solo se puede ingresar URL de imagen
- **Al editar material**: Se puede:
  - Subir archivo desde dispositivo (móvil o desktop)
  - Ingresar URL de imagen

### Optimizaciones automáticas

Las imágenes subidas se optimizan automáticamente:
- ✅ Resize a máximo 1024px en cualquier dimensión
- ✅ Compresión a ~80% de calidad
- ✅ Conversión a formato JPEG
- ✅ Eliminación de metadatos EXIF
- ✅ Tamaño máximo 1MB después de compresión

## Troubleshooting

### Error: "new row violates row-level security policy"

**Causa**: Las políticas RLS no están configuradas correctamente.

**Solución**: Ejecuta los comandos SQL del Paso 2.

### Error: "Bucket not found"

**Causa**: El bucket `material` no existe.

**Solución**: Crea el bucket como se indica en el Paso 1.

### Las imágenes no se muestran

**Causa**: El bucket no está configurado como público.

**Solución**: 
1. Ve a **Storage** > **material** > **Configuration**
2. Activa **Public bucket**
3. Guarda los cambios

