export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      materials: {
        Row: {
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
          hospital_pickup: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          uv?: number | null // Items per box
          name: string
          description?: string | null
          unit: string
          usage_per_session: number
          current_stock?: number
          photo_url?: string | null
          notes?: string | null
          hospital_pickup?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          uv?: number | null // Items per box
          name?: string
          description?: string | null
          unit?: string
          usage_per_session?: number
          current_stock?: number
          photo_url?: string | null
          notes?: string | null
          hospital_pickup?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      settings: {
        Row: {
          id: string
          key: string
          value: Json
          description: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          key: string
          value: Json
          description?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          key?: string
          value?: Json
          description?: string | null
          updated_at?: string
        }
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: 'inventory_logs_material_id_fkey'
            columns: ['material_id']
            referencedRelation: 'materials'
            referencedColumns: ['id']
          }
        ]
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
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey'
            columns: ['order_id']
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_items_material_id_fkey'
            columns: ['material_id']
            referencedRelation: 'materials'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
