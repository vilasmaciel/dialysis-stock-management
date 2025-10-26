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

// Type-safe setting keys
export type SettingKey = 'inventory_sessions' | 'system'

// Helper type to map setting keys to their value types
export type SettingValue<K extends SettingKey> = K extends 'inventory_sessions'
  ? InventorySessionsConfig
  : K extends 'system'
    ? SystemConfig
    : never

// Material with calculated fields (for frontend use)
export interface MaterialWithCalculations {
  id: string
  code: string
  uv: string | null
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
  const order_quantity = sessions_needed * material.usage_per_session

  return {
    ...material,
    available_sessions,
    order_quantity,
    needs_order: available_sessions < config.min_sessions,
  }
}

