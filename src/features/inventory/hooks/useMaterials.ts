import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '#/shared/api/supabase'
import { useSetting } from '#/shared/hooks/useSettings'
import { calculateMaterialFields } from '#/shared/types/settings'
import type { MaterialWithStats } from '#/shared/types'

export function useMaterials() {
  const { data: sessionsConfig, isLoading: isLoadingSettings } = useSetting('inventory_sessions')

  const query = useQuery({
    queryKey: ['materials', sessionsConfig],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error

      if (!sessionsConfig) {
        return []
      }

      // Calculate stats for each material using global config
      const materialsWithStats: MaterialWithStats[] = data.map((material) => {
        const materialWithCalc = calculateMaterialFields(material, sessionsConfig)

        return {
          id: material.id,
          code: material.code,
          itemsPerBox: material.uv || undefined,
          name: material.name,
          description: material.description || undefined,
          unit: material.unit,
          usagePerSession: material.usage_per_session,
          currentStock: material.current_stock,
          photoUrl: material.photo_url || undefined,
          hospitalPickup: material.hospital_pickup,
          minSessions: sessionsConfig.min_sessions,
          maxSessions: sessionsConfig.max_sessions,
          orderQuantity: materialWithCalc.order_quantity,
          notes: material.notes || undefined,
          createdAt: material.created_at,
          updatedAt: material.updated_at,
          availableSessions: materialWithCalc.available_sessions,
          needsOrder: materialWithCalc.needs_order,
          boxesToOrder: materialWithCalc.boxes_to_order,
          unitsToOrder: Math.max(0, materialWithCalc.order_quantity),
        }
      })

      // Sort by availableSessions ascending (lowest first)
      return materialsWithStats.sort((a, b) => a.availableSessions - b.availableSessions)
    },
    enabled: !!sessionsConfig,
  })

  return {
    ...query,
    isLoading: query.isLoading || isLoadingSettings,
  }
}

export function useMaterial(id: string) {
  const { data: sessionsConfig, isLoading: isLoadingSettings } = useSetting('inventory_sessions')

  const query = useQuery({
    queryKey: ['materials', id, sessionsConfig],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      if (!sessionsConfig) {
        throw new Error('Session config not loaded')
      }

      const materialWithCalc = calculateMaterialFields(data, sessionsConfig)

      const material: MaterialWithStats = {
        id: data.id,
        code: data.code,
        itemsPerBox: data.uv || undefined,
        name: data.name,
        description: data.description || undefined,
        unit: data.unit,
        usagePerSession: data.usage_per_session,
        currentStock: data.current_stock,
        photoUrl: data.photo_url || undefined,
        hospitalPickup: data.hospital_pickup,
        minSessions: sessionsConfig.min_sessions,
        maxSessions: sessionsConfig.max_sessions,
        orderQuantity: materialWithCalc.order_quantity,
        notes: data.notes || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        availableSessions: materialWithCalc.available_sessions,
        needsOrder: materialWithCalc.needs_order,
        boxesToOrder: materialWithCalc.boxes_to_order,
        unitsToOrder: Math.max(0, materialWithCalc.order_quantity),
      }

      return material
    },
    enabled: !!sessionsConfig,
  })

  return {
    ...query,
    isLoading: query.isLoading || isLoadingSettings,
  }
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

