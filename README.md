# 🩺 Control de Material de Diálisis

Una aplicación móvil intuitiva para gestionar el stock de materiales consumibles para diálisis domiciliaria (hemodiálisis o peritoneal).

## 📋 Características Principales

### ✅ Implementadas

- **Vista de Inventario**: Lista completa de materiales con indicadores visuales de stock (verde/rojo)
- **Cálculo Automático**: Determina automáticamente cuántas sesiones quedan con el stock actual
- **Alertas de Stock Bajo**: Indicadores rojos cuando el stock está por debajo del mínimo (7 sesiones)
- **Autenticación con Google**: Login seguro usando tu cuenta de Google
- **Edición de Items**:
  - Botones grandes +1/-1 para ajustes rápidos
  - Edición manual de cantidades
  - Preview en tiempo real de sesiones disponibles
  - Validaciones y feedback visual
- **Modo Revisión**:
  - Checklist guiado material por material
  - Barra de progreso visual
  - Navegación anterior/siguiente
  - Resumen final con estadísticas
  - Guardado batch de todos los cambios
- **Generación de Pedidos**:
  - Detección automática de materiales con stock bajo
  - Selección múltiple de items
  - Exportación a Excel con formato estructurado
  - Guardado de pedidos en Supabase
  - Descarga automática del archivo
- **Sistema de Logging**: Registro automático de todos los cambios en el inventario

### 🚧 Próximamente

- **Gestión de Fotos**: Subir y mostrar fotos de los materiales
- **Historial Visual**: Gráficos y visualización del historial de cambios
- **Notificaciones**: Alertas cuando el stock esté bajo
- **Modo Offline**: Funcionalidad sin conexión a internet
- **Múltiples Usuarios**: Gestión de permisos y roles

## 🛠️ Stack Tecnológico

- **Frontend**: React 19.1.0
- **Build Tool**: Vite
- **Router**: TanStack Router (file-based routing)
- **Data Fetching**: TanStack Query (React Query)
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **UI**: Tailwind CSS v4 + Shadcn/ui
- **Styling**: CSS Modules
- **Testing**: Vitest + React Testing Library + MSW
- **Linting**: Biome

## 🚀 Setup Rápido

### Requisitos Previos

- Node.js 20.18+ o superior
- npm o yarn
- Cuenta de Supabase (gratuita)
- Cuenta de Google Cloud para OAuth

### 1. Clonar el Repositorio

\`\`\`bash
git clone <repository-url>
cd dialysis-stock-management
\`\`\`

### 2. Instalar Dependencias

\`\`\`bash
npm install
\`\`\`

### 3. Configurar Supabase

Sigue la guía detallada en [docs/SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md) para:
- Crear un proyecto en Supabase
- Configurar el esquema de base de datos
- Habilitar Row Level Security
- Obtener las credenciales

### 4. Configurar Google OAuth

Sigue la guía en [docs/GOOGLE_OAUTH_SETUP.md](./docs/GOOGLE_OAUTH_SETUP.md) para:
- Crear un proyecto en Google Cloud Console
- Configurar el OAuth Consent Screen
- Obtener Client ID y Client Secret
- Configurar las credenciales en Supabase

### 5. Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

\`\`\`env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbG...
\`\`\`

### 6. Iniciar la Aplicación

\`\`\`bash
npm run dev
\`\`\`

La aplicación estará disponible en [http://localhost:5173](http://localhost:5173)

## 📁 Estructura del Proyecto

\`\`\`
src/
├── features/               # Features organizadas por dominio
│   ├── inventory/         # Gestión de inventario
│   │   ├── components/    # Componentes de la feature
│   │   ├── hooks/         # Hooks personalizados
│   │   └── types/         # Tipos específicos
│   ├── auth/              # Autenticación
│   ├── orders/            # Generación de pedidos
│   └── review/            # Modo revisión
├── shared/                # Código compartido
│   ├── api/               # Cliente de Supabase y tipos
│   ├── components/        # Componentes reutilizables
│   │   └── ui/            # Componentes de Shadcn/ui
│   ├── contexts/          # React contexts
│   ├── hooks/             # Hooks compartidos
│   ├── lib/               # Utilidades
│   └── types/             # Tipos compartidos
├── routes/                # Rutas de TanStack Router
│   ├── __root.tsx         # Layout raíz
│   ├── index.tsx          # Página de inicio
│   ├── login.tsx          # Página de login
│   └── _authenticated/    # Rutas protegidas
│       ├── dashboard.tsx  # Dashboard principal
│       └── inventory.tsx  # Vista de inventario
├── main.tsx               # Punto de entrada
└── index.css              # Estilos globales
\`\`\`

## 🧪 Testing

\`\`\`bash
# Ejecutar tests
npm test

# Ejecutar tests con UI
npm run test:ui

# Ejecutar tests en modo watch
npm test -- --watch
\`\`\`

## 🎨 Linting y Formatting

\`\`\`bash
# Verificar código
npm run lint

# Auto-fix problemas
npm run lint:fix
\`\`\`

## 📦 Build para Producción

\`\`\`bash
npm run build
\`\`\`

El build se generará en la carpeta `dist/`

## 🗄️ Esquema de Base de Datos

### Tabla: materials
Almacena la información de cada material de diálisis

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único |
| code | TEXT | Código del material (ej: DIA-001) |
| name | TEXT | Nombre del material |
| unit | TEXT | Unidad de medida (unidades, ml, etc.) |
| usage_per_session | DECIMAL | Cantidad usada por sesión |
| current_stock | DECIMAL | Stock actual |
| min_sessions | INTEGER | Sesiones mínimas de reserva (default: 7) |
| max_sessions | INTEGER | Sesiones máximas (default: 20) |
| order_quantity | DECIMAL | Cantidad a pedir cuando está bajo |

### Tabla: inventory_logs
Registro de todos los cambios en el inventario

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único |
| material_id | UUID | Referencia al material |
| previous_stock | DECIMAL | Stock anterior |
| new_stock | DECIMAL | Stock nuevo |
| change | DECIMAL | Cantidad cambiada |
| change_type | TEXT | Tipo: manual, review, order, usage |
| user_id | UUID | ID del usuario |
| user_name | TEXT | Nombre del usuario |

### Tabla: orders
Pedidos generados

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único |
| order_number | TEXT | Número de pedido |
| status | TEXT | Estado: draft, pending, completed |
| user_id | UUID | ID del usuario |

### Tabla: order_items
Items de cada pedido

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | UUID | ID único |
| order_id | UUID | Referencia al pedido |
| material_id | UUID | Referencia al material |
| quantity | DECIMAL | Cantidad a pedir |

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📚 Documentación del Proyecto

### Guías de Setup
- **[QUICK_START.md](./docs/QUICK_START.md)** - ⚡ Recupera el contexto en 2 minutos
- **[SETUP_COMPLETO.md](./docs/SETUP_COMPLETO.md)** - Guía completa paso a paso desde cero
- **[SUPABASE_SETUP.md](./docs/SUPABASE_SETUP.md)** - Configuración de base de datos
- **[GOOGLE_OAUTH_SETUP.md](./docs/GOOGLE_OAUTH_SETUP.md)** - Configuración de autenticación

### Estado y Contexto del Proyecto
- **[PROJECT_STATUS.md](./docs/PROJECT_STATUS.md)** - 📋 Estado completo del proyecto
- **[DEV_MEMORY.md](./docs/DEV_MEMORY.md)** - 🧠 Memoria técnica y decisiones de arquitectura

### Personalización
- **[EXCEL_FORMAT_CUSTOMIZATION.md](./docs/EXCEL_FORMAT_CUSTOMIZATION.md)** - Personalizar formato de Excel
- **[TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md)** - Solución de problemas comunes

### Scripts SQL
- **[sql/README.md](./docs/sql/README.md)** - Índice de todos los scripts SQL
- **[sql/00_full_schema.sql](./docs/sql/00_full_schema.sql)** - Schema completo en un archivo
- **[YOUR_MATERIALS.sql](./docs/YOUR_MATERIALS.sql)** - Tus 23 materiales específicos

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles

## 👥 Usuarios Objetivo

- Pacientes de diálisis domiciliaria (probablemente ancianos)
- Cuidadores sin experiencia técnica
- Usuarios con posibles problemas visuales o cognitivos leves

## 🎯 Objetivos de UX

- **Interfaz táctil intuitiva** con botones grandes
- **Mensajes claros** y feedback visual
- **Prevenir errores** mediante validaciones
- **Alertas visuales** con indicadores de color (verde/rojo)
- **Proceso guiado** para revisión de inventario

## 🔐 Seguridad

- Autenticación mediante Google OAuth
- Row Level Security (RLS) en Supabase
- Las variables de entorno nunca se incluyen en el repositorio
- Todas las comunicaciones con Supabase usan HTTPS

## 📱 Responsive Design

La aplicación está optimizada para:
- 📱 Móviles (iOS y Android)
- 📱 Tablets
- 💻 Desktop

## 🎨 Personalización

### Formato Excel del Proveedor

El formato del Excel generado puede ser personalizado según las necesidades de tu proveedor. Ver la guía completa en [docs/EXCEL_FORMAT_CUSTOMIZATION.md](./docs/EXCEL_FORMAT_CUSTOMIZATION.md)

Características del formato actual:
- Encabezado con información del pedido
- Tabla con columnas: Código, Descripción, Cantidad, Unidad, Notas
- Total de items
- Nombre de archivo: `pedido_[NÚMERO]_[FECHA].xlsx`

### Materiales

Para agregar tus materiales de diálisis, puedes:
1. Insertarlos directamente en Supabase (ver guía SUPABASE_SETUP.md)
2. Crear una interfaz de administración (próximamente)
3. Importar desde un archivo CSV/Excel (próximamente)

## 🐛 Reporte de Bugs

Si encuentras algún bug, por favor abre un issue con:
- Descripción del problema
- Pasos para reproducirlo
- Comportamiento esperado vs actual
- Screenshots (si aplica)

## ✨ Estado del Proyecto

**Versión Actual**: 1.0.0 (MVP Completo)

**✅ Completado**:
- Setup inicial del proyecto con Vite + React 19
- Configuración de Supabase y base de datos completa
- Sistema de autenticación con Google OAuth
- Vista de inventario con indicadores visuales
- Cálculo automático de sesiones disponibles
- Edición de items con botones +1/-1 y modo manual
- Modo revisión de inventario (checklist guiado)
- Generación y exportación de pedidos a Excel
- Sistema de logging automático de cambios
- Rutas protegidas y gestión de sesiones
- UI/UX optimizada para usuarios mayores

**📝 Documentación**:
- ✅ Guía de configuración de Supabase
- ✅ Guía de configuración de Google OAuth
- ✅ Guía de personalización del formato Excel
- ✅ README completo con instrucciones

**🚧 Próximas Features**:
- Gestión de fotos de materiales
- Historial visual con gráficos
- Notificaciones push cuando el stock esté bajo
- Modo offline con sincronización
- Tests comprehensivos (E2E y unitarios)
- Múltiples proveedores y formatos de Excel
- Exportación a PDF
- Dashboard con estadísticas
