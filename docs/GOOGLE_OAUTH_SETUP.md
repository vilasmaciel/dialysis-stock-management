# 🔐 Guía de Configuración de Google OAuth

Esta guía te ayudará a configurar la autenticación con Google para la aplicación.

## 📋 Requisitos Previos

- Proyecto de Supabase creado (ver [SUPABASE_SETUP.md](./SUPABASE_SETUP.md))
- Cuenta de Google
- Acceso a [Google Cloud Console](https://console.cloud.google.com)

## 1️⃣ Crear Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Click en el menú desplegable del proyecto (arriba a la izquierda)
3. Click en "NEW PROJECT"
4. Completa:
   - **Project name**: `dialysis-stock-app` (o el nombre que prefieras)
   - **Organization**: Déjalo en blanco si es personal
5. Click en "CREATE"

## 2️⃣ Configurar OAuth Consent Screen

1. En el menú lateral, ve a **APIs & Services** → **OAuth consent screen**
2. Selecciona **External** como User Type
3. Click en "CREATE"
4. Completa el formulario:
   - **App name**: `Control de Material de Diálisis`
   - **User support email**: Tu email
   - **App logo**: (Opcional) Puedes subir un logo después
   - **App domain**:
     - Application home page: `https://tu-dominio.com` (o déjalo vacío por ahora)
   - **Authorized domains**:
     - Agrega tu dominio de Supabase: `xxxxx.supabase.co` (reemplaza con tu Project ID)
   - **Developer contact information**: Tu email
5. Click en "SAVE AND CONTINUE"
6. En **Scopes**, click en "ADD OR REMOVE SCOPES"
7. Selecciona:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
   - `openid`
8. Click en "UPDATE" y luego "SAVE AND CONTINUE"
9. En **Test users**, puedes agregar emails de usuarios de prueba (opcional en desarrollo)
10. Click en "SAVE AND CONTINUE"
11. Revisa el resumen y click en "BACK TO DASHBOARD"

## 3️⃣ Crear Credenciales OAuth 2.0

1. Ve a **APIs & Services** → **Credentials**
2. Click en "CREATE CREDENTIALS" → "OAuth client ID"
3. Selecciona **Application type**: "Web application"
4. Completa:
   - **Name**: `Dialysis Stock Web Client`
   - **Authorized JavaScript origins**:
     - `http://localhost:5173` (para desarrollo)
     - `https://xxxxx.supabase.co` (tu URL de Supabase)
   - **Authorized redirect URIs**:
     - `https://xxxxx.supabase.co/auth/v1/callback` (⚠️ IMPORTANTE: reemplaza xxxxx con tu Project ID de Supabase)
5. Click en "CREATE"
6. 🔑 **GUARDA ESTAS CREDENCIALES**:
   - **Client ID**: Un string largo como `123456789-abc...googleusercontent.com`
   - **Client Secret**: Un string corto como `GOCSPX-...`

## 4️⃣ Configurar Google OAuth en Supabase

1. Ve a tu proyecto de Supabase
2. Navega a **Authentication** → **Providers**
3. Busca "Google" en la lista de providers
4. Habilita el toggle "Enable Sign in with Google"
5. Completa los campos:
   - **Client ID**: Pega el Client ID de Google que acabas de obtener
   - **Client Secret**: Pega el Client Secret de Google
6. **Copia la Redirect URL** que Supabase te muestra (algo como `https://xxxxx.supabase.co/auth/v1/callback`)
7. Click en "Save"

## 5️⃣ Verificar Redirect URI en Google Cloud Console

⚠️ **IMPORTANTE**: Asegúrate de que la Redirect URL en Google Cloud Console coincida EXACTAMENTE con la que Supabase te proporcionó.

1. Vuelve a [Google Cloud Console](https://console.cloud.google.com)
2. Ve a **APIs & Services** → **Credentials**
3. Click en tu OAuth 2.0 Client ID
4. En **Authorized redirect URIs**, verifica que está:
   - `https://xxxxx.supabase.co/auth/v1/callback` (debe coincidir con la URL de Supabase)
5. Si no coincide, actualízala y guarda

## 6️⃣ Probar la Autenticación

✅ **El botón de login ya está implementado** en la aplicación en `/login`.

### Flujo de Autenticación:

1. Usuario hace click en "Iniciar sesión con Google"
2. Se abre una ventana de Google OAuth
3. Usuario selecciona su cuenta de Google
4. Google redirige a Supabase con el token
5. Supabase crea la sesión del usuario
6. Usuario es redirigido a la aplicación

## 🔧 Configuración de Dominio Propio (Opcional - Producción)

Si vas a desplegar en producción con tu propio dominio:

1. En Google Cloud Console, agrega tu dominio a:
   - **Authorized JavaScript origins**: `https://tu-dominio.com`
   - **Authorized redirect URIs**: Mantén la de Supabase
2. En **OAuth consent screen** → **Authorized domains**, agrega `tu-dominio.com`

## 🐛 Solución de Problemas

### Error: "redirect_uri_mismatch"
- Verifica que la Redirect URI en Google Cloud Console coincida EXACTAMENTE con la de Supabase
- Asegúrate de incluir `/auth/v1/callback` al final

### Error: "Access blocked: This app's request is invalid"
- Verifica que hayas completado el OAuth Consent Screen
- Asegúrate de que el email que estás usando esté en la lista de Test Users (si está en modo Testing)

### La ventana de OAuth se cierra inmediatamente
- Revisa la consola del navegador para ver errores
- Verifica que las credenciales en Supabase sean correctas

## ✅ Verificación

Para verificar que todo funciona:

1. En Supabase, ve a **Authentication** → **Providers**
2. Google debería estar en verde (enabled)
3. Cuando implementes el login en la app, deberías poder autenticarte

## 🔐 Seguridad

⚠️ **IMPORTANTE**:
- Nunca compartas tu **Client Secret** públicamente
- Nunca subas archivos `.env` al repositorio
- El archivo `.env` debe estar en `.gitignore`

## 📝 Próximos Pasos

Ahora puedes continuar con la implementación del sistema de autenticación en la aplicación. El código para integrar Google OAuth con Supabase se encuentra en `src/features/auth/`.
