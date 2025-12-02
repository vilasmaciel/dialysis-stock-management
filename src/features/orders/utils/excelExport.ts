import * as XLSX from 'xlsx'
import type { OrderItem } from '#/shared/types'

export interface ExcelExportOptions {
  orderNumber: string
  items: OrderItem[]
  sheetName?: string
  returnBlob?: boolean
}

/**
 * Calcula el número de cajas a partir del formato UV y la cantidad total
 * @param uv - Formato "C/X" donde X es el número de items por caja (ej: "C/24")
 * @param quantity - Cantidad total de unidades
 * @returns Número de cajas necesarias (redondeado hacia arriba)
 */
function calculateBoxes(uv: string | undefined, quantity: number): number {
  if (!uv || !uv.includes('/')) {
    return quantity
  }

  const itemsPerBox = parseInt(uv.split('/')[1])
  if (isNaN(itemsPerBox) || itemsPerBox === 0) {
    return quantity
  }

  return Math.ceil(quantity / itemsPerBox)
}

/**
 * Genera y descarga un archivo Excel con el formato de la plantilla CVC
 * Formato: Fungibles | CÓDIGO | UV | DESCRIPCIÓN | Cantidad | Lote / Nº serie
 */
export function exportToExcel(options: ExcelExportOptions): Blob | string {
  const { orderNumber, items, sheetName = 'Fungibles' } = options

  // Crear datos para el Excel
  const data: any[] = []

  // Fila 1: Encabezado "Fungibles" (se extenderá por merge)
  data.push(['Fungibles'])

  // Fila 2: Encabezados de columnas
  data.push(['CÓDIGO', 'UV', 'DESCRIPCIÓN', 'Cantidad', 'Lote / Nº serie'])

  // Filas de datos: agregar items
  items.forEach((item) => {
    const boxes = calculateBoxes(item.uv, item.quantity)
    data.push([
      item.code,
      item.uv || '',
      item.description,
      boxes,
      '', // Lote / Nº serie - siempre vacío
    ])
  })

  // Crear workbook y worksheet
  const worksheet = XLSX.utils.aoa_to_sheet(data)

  // Merge de la primera fila (Fungibles) para que abarque todas las columnas
  worksheet['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } }]

  // Establecer ancho de columnas
  worksheet['!cols'] = [
    { wch: 10 }, // CÓDIGO
    { wch: 8 },  // UV
    { wch: 50 }, // DESCRIPCIÓN
    { wch: 10 }, // Cantidad
    { wch: 15 }, // Lote / Nº serie
  ]

  // Aplicar estilos a las celdas de encabezado
  // Fila 1: Fungibles (bold)
  if (worksheet['A1']) {
    worksheet['A1'].s = {
      font: { bold: true },
      alignment: { horizontal: 'center', vertical: 'center' },
    }
  }

  // Fila 2: Encabezados de columnas (bold)
  const headerCells = ['A2', 'B2', 'C2', 'D2', 'E2']
  headerCells.forEach((cell) => {
    if (worksheet[cell]) {
      worksheet[cell].s = {
        font: { bold: true },
        alignment: { horizontal: 'center', vertical: 'center' },
      }
    }
  })

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

  const filename = `pedido_${orderNumber}_${new Date().toISOString().split('T')[0]}.xlsx`

  // If returnBlob is true, return Blob instead of downloading
  if (options.returnBlob) {
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const blob = new Blob([wbout], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    return blob
  }

  // Otherwise, download the file
  XLSX.writeFile(workbook, filename)
  return filename
}
