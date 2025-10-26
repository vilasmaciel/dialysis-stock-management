import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '#/shared/api/supabase'
import type { Database, Json } from '#/shared/api/database.types'
import type { SettingKey, SettingValue } from '#/shared/types/settings'

// Query key factory
export const settingsKeys = {
  all: ['settings'] as const,
  byKey: (key: SettingKey) => [...settingsKeys.all, key] as const,
}

/**
 * Hook to fetch a specific setting by key
 */
export function useSetting<K extends SettingKey>(key: K) {
  return useQuery({
    queryKey: settingsKeys.byKey(key),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('key', key)
        .single()

      if (error) throw error
      return data.value as unknown as SettingValue<K>
    },
  })
}

/**
 * Hook to fetch all settings
 */
export function useSettings() {
  return useQuery({
    queryKey: settingsKeys.all,
    queryFn: async () => {
      const { data, error } = await supabase.from('settings').select('*')

      if (error) throw error
      return data
    },
  })
}

/**
 * Hook to update a setting
 */
export function useUpdateSetting() {
  const queryClient = useQueryClient()

  return useMutation<
    Database['public']['Tables']['settings']['Row'],
    Error,
    { key: SettingKey; value: Json }
  >({
    mutationFn: async (variables) => {
      const { data, error } = await supabase
        .from('settings')
        .update({ value: variables.value, updated_at: new Date().toISOString() })
        .eq('key', variables.key)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (_, variables) => {
      // Invalidate the specific setting and all settings
      queryClient.invalidateQueries({ queryKey: settingsKeys.byKey(variables.key) })
      queryClient.invalidateQueries({ queryKey: settingsKeys.all })
    },
  })
}

