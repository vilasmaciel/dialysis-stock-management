import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '#/shared/api/supabase'
import type { MaterialWithStats } from '#/shared/types'

export function useMaterials() {
  return useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error

      // Calculate stats for each material
      const materialsWithStats: MaterialWithStats[] = data.map((material) => {
        const availableSessions = calculateAvailableSessions(
          material.current_stock,
          material.usage_per_session
        )
        const needsOrder = availableSessions < material.min_sessions
        const unitsToOrder = needsOrder
          ? material.order_quantity - material.current_stock
          : 0

        return {
          id: material.id,
          code: material.code,
          uv: material.uv || undefined,
          name: material.name,
          description: material.description || undefined,
          unit: material.unit,
          usagePerSession: material.usage_per_session,
          currentStock: material.current_stock,
          photoUrl: material.photo_url || undefined,
          minSessions: material.min_sessions,
          maxSessions: material.max_sessions,
          orderQuantity: material.order_quantity,
          notes: material.notes || undefined,
          createdAt: material.created_at,
          updatedAt: material.updated_at,
          availableSessions,
          needsOrder,
          unitsToOrder: Math.max(0, unitsToOrder),
        }
      })

      return materialsWithStats
    },
  })
}

export function useMaterial(id: string) {
  return useQuery({
    queryKey: ['materials', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      const availableSessions = calculateAvailableSessions(
        data.current_stock,
        data.usage_per_session
      )
      const needsOrder = availableSessions < data.min_sessions
      const unitsToOrder = needsOrder ? data.order_quantity - data.current_stock : 0

      const material: MaterialWithStats = {
        id: data.id,
        code: data.code,
        uv: data.uv || undefined,
        name: data.name,
        description: data.description || undefined,
        unit: data.unit,
        usagePerSession: data.usage_per_session,
        currentStock: data.current_stock,
        photoUrl: data.photo_url || undefined,
        minSessions: data.min_sessions,
        maxSessions: data.max_sessions,
        orderQuantity: data.order_quantity,
        notes: data.notes || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        availableSessions,
        needsOrder,
        unitsToOrder: Math.max(0, unitsToOrder),
      }

      return material
    },
  })
}

export function useUpdateMaterialStock() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      materialId,
      newStock,
      userId,
      userName,
      changeType,
      notes,
    }: {
      materialId: string
      newStock: number
      userId: string
      userName: string
      changeType: 'manual' | 'review' | 'order' | 'usage'
      notes?: string
    }) => {
      // Get current stock
      const { data: material, error: getMaterialError } = await supabase
        .from('materials')
        .select('current_stock')
        .eq('id', materialId)
        .single()

      if (getMaterialError) throw getMaterialError

      const previousStock = material.current_stock
      const change = newStock - previousStock

      // Update material stock
      const { error: updateError } = await supabase
        .from('materials')
        .update({ current_stock: newStock })
        .eq('id', materialId)

      if (updateError) throw updateError

      // Create inventory log
      const { error: logError } = await supabase.from('inventory_logs').insert({
        material_id: materialId,
        previous_stock: previousStock,
        new_stock: newStock,
        change,
        change_type: changeType,
        user_id: userId,
        user_name: userName,
        notes: notes || null,
      })

      if (logError) throw logError

      return { previousStock, newStock, change }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] })
    },
  })
}

function calculateAvailableSessions(stock: number, usagePerSession: number): number {
  if (usagePerSession === 0) {
    return 9999 // Infinite sessions if not used
  }
  return Math.floor(stock / usagePerSession)
}
