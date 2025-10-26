export interface Material {
  id: string
  code: string // Código del proveedor
  uv?: string // Presentación del proveedor (ej: C/2, C/24)
  name: string
  description?: string
  unit: string // 'unidades', 'ml', etc.
  usagePerSession: number // Cantidad usada por sesión
  currentStock: number
  photoUrl?: string
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
  unitsToOrder: number // Cantidad de unidades a pedir
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
  uv?: string // Presentación del proveedor
  description: string
  quantity: number
  unit: string
  notes?: string
}
