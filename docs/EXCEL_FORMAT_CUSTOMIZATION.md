# 📄 Guía de Personalización del Formato Excel

Esta guía explica cómo personalizar el formato del archivo Excel generado para adaptarlo a los requisitos específicos de tu proveedor.

## 📍 Ubicación del Código

El código para la exportación a Excel se encuentra en:
\`\`\`
src/features/orders/utils/excelExport.ts
\`\`\`

## 🎨 Formato Actual (Genérico)

El formato actual incluye:

1. **Encabezado del Pedido**:
   - Título: "PEDIDO DE MATERIAL DE DIÁLISIS"
   - Número de Pedido
   - Fecha
   - Nombre del solicitante

2. **Tabla de Items**:
   | Código | Descripción | Cantidad | Unidad | Notas |
   |--------|-------------|----------|--------|-------|

3. **Total de Items**

## ✏️ Personalizar el Formato

### Ejemplo 1: Cambiar las Columnas

Si tu proveedor requiere columnas diferentes:

\`\`\`typescript
// En excelExport.ts, modifica la línea de encabezados:
data.push(['Código', 'Descripción', 'Cantidad', 'Unidad', 'Notas'])

// Por ejemplo, para agregar una columna de "Precio":
data.push(['Código', 'Descripción', 'Cantidad', 'Unidad', 'Precio', 'Notas'])

// Y ajusta cada item:
items.forEach((item) => {
  data.push([
    item.code,
    item.description,
    item.quantity,
    item.unit,
    '', // Precio (puedes agregarlo al tipo OrderItem)
    item.notes || '',
  ])
})
\`\`\`

### Ejemplo 2: Cambiar el Nombre de las Columnas

\`\`\`typescript
// Formato en español (actual)
data.push(['Código', 'Descripción', 'Cantidad', 'Unidad', 'Notas'])

// Formato con otros nombres
data.push(['REF', 'PRODUCTO', 'CANT.', 'UM', 'OBSERVACIONES'])
\`\`\`

### Ejemplo 3: Formato sin Encabezado

Si tu proveedor solo necesita la tabla sin información adicional:

\`\`\`typescript
export function exportToExcelSimple(options: ExcelExportOptions) {
  const { items, sheetName = 'Pedido' } = options

  const data: any[] = []

  // Solo encabezados de tabla
  data.push(['Código', 'Descripción', 'Cantidad', 'Unidad'])

  // Items
  items.forEach((item) => {
    data.push([item.code, item.description, item.quantity, item.unit])
  })

  // ... resto del código de exportación
}
\`\`\`

### Ejemplo 4: Formato Específico del Proveedor

Crea una función personalizada para tu proveedor:

\`\`\`typescript
/**
 * Formato para Proveedor XYZ
 * Requiere: Hoja "PEDIDO" con columnas específicas y formato especial
 */
export function exportToExcelProveedorXYZ(options: ExcelExportOptions) {
  const { orderNumber, orderDate, items } = options

  const data: any[] = []

  // Encabezado específico del proveedor
  data.push(['PROVEEDOR XYZ - SOLICITUD DE MATERIAL'])
  data.push([])
  data.push(['PEDIDO:', orderNumber])
  data.push(['FECHA:', orderDate])
  data.push(['CLIENTE:', 'TU NOMBRE/EMPRESA'])
  data.push([])

  // Tabla con formato del proveedor
  data.push(['REF.', 'DESCRIPCIÓN', 'CANT', 'UM', 'OBS'])

  items.forEach((item) => {
    data.push([
      item.code,
      item.description,
      item.quantity,
      item.unit,
      item.notes || 'N/A',
    ])
  })

  // Footer específico
  data.push([])
  data.push(['Total Items:', items.length])
  data.push([])
  data.push(['Firma:', '___________________'])

  // Crear worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(data)

  // Anchos de columna personalizados
  worksheet['!cols'] = [
    { wch: 12 }, // REF
    { wch: 45 }, // DESCRIPCIÓN
    { wch: 10 }, // CANT
    { wch: 8 },  // UM
    { wch: 25 }, // OBS
  ]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'PEDIDO')

  // Nombre de archivo personalizado
  const filename = \`PEDIDO_XYZ_\${orderNumber}_\${new Date().toISOString().split('T')[0]}.xlsx\`
  XLSX.writeFile(workbook, filename)

  return filename
}
\`\`\`

### Ejemplo 5: Múltiples Hojas

Si necesitas un Excel con múltiples pestañas:

\`\`\`typescript
export function exportToExcelMultiSheet(options: ExcelExportOptions) {
  const { orderNumber, items } = options

  // Crear workbook
  const workbook = XLSX.utils.book_new()

  // Hoja 1: Resumen
  const resumenData = [
    ['RESUMEN DEL PEDIDO'],
    [],
    ['Número de Pedido:', orderNumber],
    ['Total Items:', items.length],
  ]
  const resumenSheet = XLSX.utils.aoa_to_sheet(resumenData)
  XLSX.utils.book_append_sheet(workbook, resumenSheet, 'Resumen')

  // Hoja 2: Detalle
  const detalleData = [
    ['Código', 'Descripción', 'Cantidad', 'Unidad'],
    ...items.map(item => [item.code, item.description, item.quantity, item.unit])
  ]
  const detalleSheet = XLSX.utils.aoa_to_sheet(detalleData)
  XLSX.utils.book_append_sheet(workbook, detalleSheet, 'Detalle')

  const filename = \`pedido_\${orderNumber}.xlsx\`
  XLSX.writeFile(workbook, filename)

  return filename
}
\`\`\`

## 🔧 Aplicar tu Formato Personalizado

Una vez que hayas creado tu función personalizada, actualiza el código en:

\`\`\`typescript
// src/routes/_authenticated/orders.tsx

import { exportToExcelProveedorXYZ } from '#/features/orders/utils/excelExport'

// En handleGenerateOrder, reemplaza:
exportToExcel({...})

// Por:
exportToExcelProveedorXYZ({...})
\`\`\`

## 📊 Formato de Datos Avanzado

Si necesitas agregar más información a los items del pedido:

1. **Actualiza el tipo OrderItem** en \`src/shared/types/material.ts\`:

\`\`\`typescript
export interface OrderItem {
  materialId: string
  code: string
  description: string
  quantity: number
  unit: string
  notes?: string
  // Nuevos campos
  price?: number
  supplier?: string
  category?: string
}
\`\`\`

2. **Actualiza el esquema de Supabase** si quieres guardar esta información en la base de datos

## 💡 Tips

1. **Prueba tu formato**: Genera un pedido de prueba y verifica que el Excel se vea como espera tu proveedor
2. **Copia de seguridad**: Guarda la función \`exportToExcel\` original por si necesitas revertir
3. **Versionado**: Puedes tener múltiples funciones para diferentes proveedores
4. **Documentación**: Comenta tu código para saber qué requiere cada proveedor

## 📧 Envío Automático por Email (Futuro)

Si en el futuro quieres enviar el Excel automáticamente por email:

\`\`\`typescript
// Usando un servicio como SendGrid o Resend
import { sendEmail } from '@/lib/email'

async function generateAndEmailOrder(order: Order) {
  // 1. Generar Excel
  const excelBuffer = generateExcelBuffer(order) // Función que devuelve buffer en lugar de descargar

  // 2. Enviar por email
  await sendEmail({
    to: 'proveedor@example.com',
    subject: \`Pedido \${order.orderNumber}\`,
    attachments: [{
      filename: \`pedido_\${order.orderNumber}.xlsx\`,
      content: excelBuffer
    }]
  })
}
\`\`\`

## 🆘 Ayuda

Si tienes el formato específico de tu proveedor, puedes:
1. Compartir un ejemplo del Excel que necesitas
2. Modificar \`excelExport.ts\` según este documento
3. Si necesitas ayuda, abre un issue en el repositorio
