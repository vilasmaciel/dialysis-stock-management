export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      materials: {
        Row: {
          id: string
          code: string
          uv: string | null
          name: string
          description: string | null
          unit: string
          usage_per_session: number
          current_stock: number
          photo_url: string | null
          min_sessions: number
          max_sessions: number
          order_quantity: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          uv?: string | null
          name: string
          description?: string | null
          unit: string
          usage_per_session: number
          current_stock?: number
          photo_url?: string | null
          min_sessions?: number
          max_sessions?: number
          order_quantity: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          uv?: string | null
          name?: string
          description?: string | null
          unit?: string
          usage_per_session?: number
          current_stock?: number
          photo_url?: string | null
          min_sessions?: number
          max_sessions?: number
          order_quantity?: number
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inventory_logs: {
        Row: {
          id: string
          material_id: string
          previous_stock: number
          new_stock: number
          change: number
          change_type: 'manual' | 'review' | 'order' | 'usage'
          user_id: string
          user_name: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          material_id: string
          previous_stock: number
          new_stock: number
          change: number
          change_type: 'manual' | 'review' | 'order' | 'usage'
          user_id: string
          user_name: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          material_id?: string
          previous_stock?: number
          new_stock?: number
          change?: number
          change_type?: 'manual' | 'review' | 'order' | 'usage'
          user_id?: string
          user_name?: string
          notes?: string | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          status: 'draft' | 'pending' | 'completed'
          user_id: string
          user_name: string
          notes: string | null
          created_at: string
          submitted_at: string | null
        }
        Insert: {
          id?: string
          order_number: string
          status?: 'draft' | 'pending' | 'completed'
          user_id: string
          user_name: string
          notes?: string | null
          created_at?: string
          submitted_at?: string | null
        }
        Update: {
          id?: string
          order_number?: string
          status?: 'draft' | 'pending' | 'completed'
          user_id?: string
          user_name?: string
          notes?: string | null
          created_at?: string
          submitted_at?: string | null
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          material_id: string
          code: string
          uv: string | null
          description: string
          quantity: number
          unit: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          material_id: string
          code: string
          uv?: string | null
          description: string
          quantity: number
          unit: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          material_id?: string
          code?: string
          uv?: string | null
          description?: string
          quantity?: number
          unit?: string
          notes?: string | null
          created_at?: string
        }
      }
    }
    Views: {}
    Functions: {
      calculate_available_sessions: {
        Args: { stock: number; usage_per_session: number }
        Returns: number
      }
    }
    Enums: {}
  }
}
