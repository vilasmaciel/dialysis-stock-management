import { useQuery } from '@tanstack/react-query'
import { supabase } from '#/shared/api/supabase'
import { useSetting } from '#/shared/hooks/useSettings'
import { calculateMaterialFields } from '#/shared/types/settings'
import type { MaterialWithCalculations } from '#/shared/types/settings'

/**
 * Hook to fetch materials with calculated fields (available_sessions, order_quantity, needs_order)
 * Uses global inventory_sessions configuration from settings table
 */
export function useMaterialsWithCalculations() {
  // Fetch inventory configuration
  const { data: config, isLoading: isLoadingConfig } = useSetting('inventory_sessions')

  // Fetch materials
  const materialsQuery = useQuery({
    queryKey: ['materials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      return data
    },
  })

  // Combine data
  const data: MaterialWithCalculations[] | undefined =
    config && materialsQuery.data
      ? materialsQuery.data.map((material) => calculateMaterialFields(material, config))
      : undefined

  return {
    data,
    isLoading: isLoadingConfig || materialsQuery.isLoading,
    isError: materialsQuery.isError,
    error: materialsQuery.error,
  }
}

/**
 * Hook to get materials that need ordering (below min_sessions)
 */
export function useMaterialsNeedingOrder() {
  const { data, isLoading, isError, error } = useMaterialsWithCalculations()

  const materialsNeedingOrder = data?.filter((material) => material.needs_order) ?? []

  return {
    data: materialsNeedingOrder,
    count: materialsNeedingOrder.length,
    isLoading,
    isError,
    error,
  }
}

