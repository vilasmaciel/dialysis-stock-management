import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '#/shared/api/supabase'
import type { Database } from '#/shared/api/database.types'

type MaterialInsert = Database['public']['Tables']['materials']['Insert']
type MaterialUpdate = Database['public']['Tables']['materials']['Update']

/**
 * Hook to create a new material
 */
export function useCreateMaterial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (material: MaterialInsert) => {
      const { data, error } = await supabase
        .from('materials')
        .insert(material)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] })
    },
  })
}

/**
 * Hook to update an existing material
 */
export function useUpdateMaterial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: MaterialUpdate & { id: string }) => {
      const { data, error } = await supabase
        .from('materials')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] })
    },
  })
}

/**
 * Hook to delete a material
 * Validates that the material has no order history before deletion
 */
export function useDeleteMaterial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      // Check if material has order items
      const { data: orderItems, error: checkError } = await supabase
        .from('order_items')
        .select('id', { count: 'exact', head: true })
        .eq('material_id', id)

      if (checkError) throw checkError

      // If material has order history, prevent deletion
      if (orderItems !== null) {
        const { count } = await supabase
          .from('order_items')
          .select('*', { count: 'exact', head: true })
          .eq('material_id', id)

        if (count && count > 0) {
          throw new Error(
            'No se puede eliminar este material porque tiene pedidos históricos asociados. Los materiales con historial de pedidos deben mantenerse para preservar la integridad de los registros.'
          )
        }
      }

      // Delete material if no order history exists
      const { error } = await supabase.from('materials').delete().eq('id', id)

      if (error) throw error
      return { id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] })
    },
  })
}

