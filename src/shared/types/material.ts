export interface Material {
  id: string
  code: string // Código del proveedor
  itemsPerBox?: number // Items por caja (ej: 2, 10, 24)
  name: string
  description?: string
  unit: string // 'unidades', 'ml', etc.
  usagePerSession: number // Cantidad usada por sesión
  currentStock: number
  photoUrl?: string
  hospitalPickup: boolean // Si se recoge en hospital (no se pide al proveedor)
  minSessions: number // Sesiones mínimas de reserva (default: 7)
  maxSessions: number // Sesiones máximas (default: 20)
  orderQuantity: number // Cantidad a pedir cuando está bajo
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface MaterialWithStats extends Material {
  availableSessions: number // Cuántas sesiones quedan con el stock actual
  needsOrder: boolean // Si está por debajo del mínimo
  boxesToOrder: number // Cantidad de cajas a pedir (si itemsPerBox existe)
  unitsToOrder: number // Cantidad de unidades a pedir (total real considerando cajas)
}

export interface InventoryLog {
  id: string
  materialId: string
  previousStock: number
  newStock: number
  change: number
  changeType: 'manual' | 'review' | 'order' | 'usage'
  userId: string
  userName: string
  notes?: string
  createdAt: string
}

export interface Order {
  id: string
  orderNumber: string
  items: OrderItem[]
  status: 'draft' | 'pending' | 'completed'
  userId: string
  userName: string
  createdAt: string
  submittedAt?: string
  notes?: string
}

export interface OrderItem {
  materialId: string
  code: string
  uv?: string // Presentación del proveedor (formato string para Excel)
  description: string
  quantity: number
  unit: string
  notes?: string
}
