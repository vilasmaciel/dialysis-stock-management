import * as XLSX from 'xlsx'
import type { OrderItem } from '#/shared/types'

export interface ExcelExportOptions {
  orderNumber: string
  orderDate: string
  userName: string
  items: OrderItem[]
  includeHeader?: boolean
  sheetName?: string
}

/**
 * Genera y descarga un archivo Excel con el pedido
 * Este formato es genérico y puede ser personalizado según las necesidades del proveedor
 */
export function exportToExcel(options: ExcelExportOptions) {
  const {
    orderNumber,
    orderDate,
    userName,
    items,
    includeHeader = true,
    sheetName = 'Pedido',
  } = options

  // Crear datos para el Excel
  const data: any[] = []

  // Opcional: Agregar encabezado con información del pedido
  if (includeHeader) {
    data.push(['PEDIDO DE MATERIAL DE DIÁLISIS'])
    data.push([])
    data.push(['Número de Pedido:', orderNumber])
    data.push(['Fecha:', orderDate])
    data.push(['Solicitado por:', userName])
    data.push([])
  }

  // Encabezados de columnas
  data.push(['Código', 'Presentación', 'Descripción', 'Cantidad', 'Unidad', 'Notas'])

  // Agregar items
  items.forEach((item) => {
    data.push([
      item.code,
      item.uv || '',
      item.description,
      item.quantity,
      item.unit,
      item.notes || '',
    ])
  })

  // Agregar totales
  data.push([])
  data.push(['TOTAL DE ITEMS:', items.length])

  // Crear workbook y worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(data)

  // Establecer ancho de columnas
  worksheet['!cols'] = [
    { wch: 12 }, // Código
    { wch: 12 }, // Presentación
    { wch: 40 }, // Descripción
    { wch: 12 }, // Cantidad
    { wch: 10 }, // Unidad
    { wch: 25 }, // Notas
  ]

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  // Descargar archivo
  const filename = `pedido_${orderNumber}_${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(workbook, filename)

  return filename
}

/**
 * Formato personalizado para un proveedor específico
 * Puedes crear múltiples funciones como esta para diferentes proveedores
 */
export function exportToExcelCustomFormat(options: ExcelExportOptions) {
  // TODO: Implementar formato específico del proveedor
  // Por ahora usa el formato genérico
  return exportToExcel(options)
}
