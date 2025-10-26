# PWA - Instalación en Móvil

La aplicación es una Progressive Web App (PWA) y se puede instalar como una app nativa en el móvil.

## Instalación

### Android (Chrome)

1. Abre la aplicación en **Chrome**
2. Verás un banner en la parte inferior que dice "Instalar DialyStock"
3. Toca **"Instalar"** o **"Agregar a pantalla de inicio"**
4. La app se instalará en tu escritorio

**Alternativa:**
- Menú (⋮) → **"Agregar a pantalla de inicio"**

### iOS (Safari)

1. Abre la aplicación en **Safari**
2. Toca el botón de **compartir** (□↑)
3. Desplázate hacia abajo
4. Toca **"Agregar a pantalla de inicio"**
5. Confirma el nombre "DialyStock"
6. Toca **"Agregar"**

## Características

- ✅ Icono en el escritorio del teléfono
- ✅ Abre en pantalla completa (sin URL del navegador)
- ✅ Splash screen automática al abrir
- ✅ Funciona como app nativa
- ⚠️ Requiere conexión a internet (no funciona offline)

## Personalización Futura

Cuando tengas el logo y el color verde pastel definidos:

### Cambiar Iconos

Reemplaza los archivos en `/public`:
- `icon-192x192.png` (192x192px)
- `icon-512x512.png` (512x512px)  
- `apple-touch-icon.png` (180x180px)
- `favicon.ico` (32x32px)

### Cambiar Colores

Edita `vite.config.ts`:

```typescript
manifest: {
  theme_color: '#A8E6CF', // Verde pastel
  background_color: '#F0FDF4', // Verde clarito
  // ...
}
```

Y actualiza `index.html`:

```html
<meta name="theme-color" content="#A8E6CF" />
```

## Desarrollo

El manifest y service worker se generan automáticamente por `vite-plugin-pwa`.

Para ver cambios:
1. Reinicia el servidor de desarrollo
2. En producción, el manifest se genera en el build

