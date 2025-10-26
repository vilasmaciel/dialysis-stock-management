# 📚 Índice de Documentación

Navegación rápida por toda la documentación del proyecto.

---

## ⚡ Inicio Rápido

### 🚀 Para Empezar
- **[QUICK_START.md](./QUICK_START.md)** ⭐
  - Recupera el contexto en 2 minutos
  - Comandos esenciales
  - Troubleshooting rápido
  - **Lee esto primero si vuelves al proyecto**

### 📖 Setup Completo
- **[SETUP_COMPLETO.md](./SETUP_COMPLETO.md)**
  - Guía paso a paso desde cero
  - Checklist completo
  - Verificación de cada paso
  - **Para primera instalación**

---

## 🗄️ Base de Datos

### 📊 Scripts SQL
- **[sql/README.md](./sql/README.md)**
  - Índice de todos los scripts
  - Orden de ejecución
  - Verificación

- **[sql/00_full_schema.sql](./sql/00_full_schema.sql)** ⭐
  - Todo el schema en un archivo
  - **Opción más rápida**

- **Scripts Individuales** (01-14)
  - Control granular
  - Debugging fácil
  - Ver carpeta `sql/`

### 🔧 Configuración
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**
  - Crear proyecto en Supabase
  - Ejecutar schema SQL
  - Configurar RLS
  - Obtener credenciales

### 📦 Materiales
- **[YOUR_MATERIALS.sql](./YOUR_MATERIALS.sql)**
  - 23 materiales específicos del usuario
  - INSERT statements listos para ejecutar
  - Query de verificación incluida

---

## 🔐 Autenticación

- **[GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)**
  - Configurar Google Cloud Console
  - OAuth Consent Screen
  - Client ID y Secret
  - Integración con Supabase
  - Troubleshooting de auth

---

## 📋 Estado del Proyecto

### 📊 Overview
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** ⭐
  - Estado actual completo
  - Features implementadas
  - Estructura de DB
  - 23 materiales incluidos
  - Configuración actual
  - Arquitectura del proyecto
  - Próximas mejoras
  - Changelog

### 🧠 Contexto Técnico
- **[DEV_MEMORY.md](./DEV_MEMORY.md)** ⭐
  - Decisiones de arquitectura con justificaciones
  - Problemas resueltos y cómo
  - Patterns y convenciones del código
  - Conceptos clave del dominio
  - Lessons learned
  - Qué cambiaría si empezara de nuevo
  - **Esencial para entender el "por qué"**

---

## 🎨 Personalización

- **[EXCEL_FORMAT_CUSTOMIZATION.md](./EXCEL_FORMAT_CUSTOMIZATION.md)**
  - Personalizar formato de Excel
  - Agregar/quitar columnas
  - Cambiar estilos
  - Ejemplos prácticos

---

## 🐛 Problemas y Soluciones

- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**
  - Login no redirige
  - Materiales no aparecen
  - Excel no descarga
  - Problemas de cache
  - Redirect URIs
  - RLS issues

---

## 📖 Por Caso de Uso

### 🆕 "Es mi primera vez con este proyecto"
1. Lee **[QUICK_START.md](./QUICK_START.md)** (2 minutos)
2. Sigue **[SETUP_COMPLETO.md](./SETUP_COMPLETO.md)** paso a paso
3. Ejecuta **[sql/00_full_schema.sql](./sql/00_full_schema.sql)**
4. Ejecuta **[YOUR_MATERIALS.sql](./YOUR_MATERIALS.sql)**
5. Sigue **[GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)**
6. `npm install && npm run dev`

### 🔄 "Vuelvo después de meses"
1. Lee **[QUICK_START.md](./QUICK_START.md)** (2 minutos)
2. Lee **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** (5 minutos)
3. `npm install && npm run dev`
4. Si hay problemas: **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**

### 🧑‍💻 "Quiero entender el código"
1. Lee **[PROJECT_STATUS.md](./PROJECT_STATUS.md)** - Overview general
2. Lee **[DEV_MEMORY.md](./DEV_MEMORY.md)** - Decisiones técnicas
3. Explora el código con el contexto ya aprendido

### 🐛 "Tengo un error"
1. **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** - Problemas comunes
2. Console del navegador (F12)
3. Logs de Supabase
4. GitHub Issues

### 🎨 "Quiero personalizar algo"
- Excel: **[EXCEL_FORMAT_CUSTOMIZATION.md](./EXCEL_FORMAT_CUSTOMIZATION.md)**
- DB Schema: **[sql/README.md](./sql/README.md)**
- Materiales: **[YOUR_MATERIALS.sql](./YOUR_MATERIALS.sql)**

### 📊 "Necesito actualizar la base de datos"
1. **[sql/README.md](./sql/README.md)** - Índice de scripts
2. Ejecuta los scripts necesarios en Supabase
3. Actualiza `database.types.ts` si cambió el schema
4. Actualiza TypeScript types en `src/shared/types/`

---

## 📂 Archivos por Categoría

### ⚡ Esenciales (Léelos primero)
- ✅ **[QUICK_START.md](./QUICK_START.md)**
- ✅ **[PROJECT_STATUS.md](./PROJECT_STATUS.md)**
- ✅ **[sql/00_full_schema.sql](./sql/00_full_schema.sql)**

### 🔧 Setup y Configuración
- **[SETUP_COMPLETO.md](./SETUP_COMPLETO.md)**
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**
- **[GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)**
- **[sql/README.md](./sql/README.md)**

### 🧠 Contexto y Arquitectura
- **[DEV_MEMORY.md](./DEV_MEMORY.md)**
- **[PROJECT_STATUS.md](./PROJECT_STATUS.md)**

### 🎨 Personalización
- **[EXCEL_FORMAT_CUSTOMIZATION.md](./EXCEL_FORMAT_CUSTOMIZATION.md)**
- **[YOUR_MATERIALS.sql](./YOUR_MATERIALS.sql)**

### 🐛 Ayuda
- **[TROUBLESHOOTING.md](./TROUBLESHOOTING.md)**

---

## 🗺️ Mapa Mental

```
📚 DOCUMENTACIÓN
│
├─⚡ INICIO RÁPIDO
│  ├─ QUICK_START.md ⭐ (2 min)
│  └─ SETUP_COMPLETO.md (30 min)
│
├─🗄️ BASE DE DATOS
│  ├─ sql/00_full_schema.sql ⭐
│  ├─ SUPABASE_SETUP.md
│  └─ YOUR_MATERIALS.sql
│
├─🔐 AUTENTICACIÓN
│  └─ GOOGLE_OAUTH_SETUP.md
│
├─📋 ESTADO
│  ├─ PROJECT_STATUS.md ⭐
│  └─ DEV_MEMORY.md ⭐
│
├─🎨 PERSONALIZACIÓN
│  └─ EXCEL_FORMAT_CUSTOMIZATION.md
│
└─🐛 PROBLEMAS
   └─ TROUBLESHOOTING.md
```

---

## 🔍 Búsqueda Rápida

### "¿Cómo hago...?"
- **Iniciar el proyecto**: [QUICK_START.md](./QUICK_START.md)
- **Configurar Supabase**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Configurar Google OAuth**: [GOOGLE_OAUTH_SETUP.md](./GOOGLE_OAUTH_SETUP.md)
- **Personalizar Excel**: [EXCEL_FORMAT_CUSTOMIZATION.md](./EXCEL_FORMAT_CUSTOMIZATION.md)
- **Solucionar error de login**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **Agregar materiales**: [YOUR_MATERIALS.sql](./YOUR_MATERIALS.sql)

### "¿Por qué...?"
- **Se usa TanStack Router**: [DEV_MEMORY.md](./DEV_MEMORY.md#-decisiones-de-arquitectura)
- **Se usa Supabase**: [DEV_MEMORY.md](./DEV_MEMORY.md#por-qué-supabase)
- **Hay un callback intermedio**: [DEV_MEMORY.md](./DEV_MEMORY.md#-autenticación---problema-resuelto)
- **Se usa DECIMAL**: [DEV_MEMORY.md](./DEV_MEMORY.md#decimal-vs-float-para-stock)

### "¿Qué es...?"
- **El campo `uv`**: [PROJECT_STATUS.md](./PROJECT_STATUS.md#-estructura-de-base-de-datos)
- **availableSessions**: [DEV_MEMORY.md](./DEV_MEMORY.md#cálculo-de-sesiones-disponibles)
- **needsOrder**: [DEV_MEMORY.md](./DEV_MEMORY.md#umbral-de-pedido)
- **RLS**: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md#4️⃣-configurar-row-level-security-rls)

---

## 📊 Estadísticas de Documentación

- **Total de archivos MD**: 11
- **Scripts SQL**: 15 (14 individuales + 1 completo)
- **Palabras totales**: ~12,000
- **Tiempo de lectura completa**: ~1 hora
- **Tiempo de lectura esencial**: ~10 minutos (QUICK_START + PROJECT_STATUS)

---

## 💡 Tips

1. **Bookmark este archivo** - Es tu punto de entrada a toda la documentación
2. **Lee QUICK_START primero** - Te da contexto en 2 minutos
3. **PROJECT_STATUS es tu amigo** - Estado actual de todo
4. **DEV_MEMORY explica el "por qué"** - Fundamental para contribuir
5. **TROUBLESHOOTING antes de preguntar** - Problemas comunes resueltos

---

**Última actualización**: 26 de Octubre, 2025
