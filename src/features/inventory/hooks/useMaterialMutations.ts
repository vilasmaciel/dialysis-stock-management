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
 */
export function useDeleteMaterial() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('materials').delete().eq('id', id)

      if (error) throw error
      return { id }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] })
    },
  })
}

