import type { Database } from '#/shared/api/database.types'

export type Setting = Database['public']['Tables']['settings']['Row']
export type SettingInsert = Database['public']['Tables']['settings']['Insert']
export type SettingUpdate = Database['public']['Tables']['settings']['Update']

// Specific setting types
export interface InventorySessionsConfig {
  min_sessions: number
  max_sessions: number
}

export interface SystemConfig {
  app_name: string
  version: string
}

export interface OrderEmailConfig {
  recipient_email: string
  cc_emails: string[]
}

// Type-safe setting keys
export type SettingKey = 'inventory_sessions' | 'system' | 'order_recipient_email' | 'order_cc_emails'

// Helper type to map setting keys to their value types
export interface SettingValueMap {
  inventory_sessions: InventorySessionsConfig
  system: SystemConfig
  order_recipient_email: string
  order_cc_emails: string[]
}

export type SettingValue<K extends SettingKey> = SettingValueMap[K]

// Material with calculated fields (for frontend use)
export interface MaterialWithCalculations {
  id: string
  code: string
  uv: number | null // Items per box
  name: string
  description: string | null
  unit: string
  usage_per_session: number
  current_stock: number
  photo_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
  // Calculated fields
  available_sessions: number
  order_quantity: number
  boxes_to_order: number
  needs_order: boolean // true if available_sessions < min_sessions
}

// Helper function to calculate material fields
export function calculateMaterialFields(
  material: Database['public']['Tables']['materials']['Row'],
  config: InventorySessionsConfig
): MaterialWithCalculations {
  const available_sessions =
    material.usage_per_session === 0
      ? 9999
      : Math.floor(material.current_stock / material.usage_per_session)

  const sessions_needed = Math.max(0, config.max_sessions - available_sessions)
  const base_order_quantity = sessions_needed * material.usage_per_session

  // Calculate boxes if itemsPerBox is defined
  let boxes_to_order = 0
  let order_quantity = base_order_quantity

  if (material.uv && material.uv > 0) {
    // Calculate number of boxes needed (round up to get complete boxes)
    boxes_to_order = Math.ceil(base_order_quantity / material.uv)
    // Recalculate actual units considering complete boxes
    order_quantity = boxes_to_order * material.uv
  }

  return {
    ...material,
    available_sessions,
    order_quantity,
    boxes_to_order,
    needs_order: available_sessions < config.max_sessions,
  }
}

