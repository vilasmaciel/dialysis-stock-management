import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '#/shared/api/supabase'
import type { UserProfile, UserProfileInput } from '#/shared/types'

// Query key factory
export const userProfileKeys = {
  all: ['user-profiles'] as const,
  byUserId: (userId: string) => [...userProfileKeys.all, userId] as const,
}

/**
 * Hook to fetch user profile by user ID
 */
export function useUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: userProfileKeys.byUserId(userId || ''),
    queryFn: async () => {
      if (!userId) throw new Error('User ID is required')

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error

      return {
        id: data.id,
        userId: data.user_id,
        fullName: data.full_name,
        phone: data.phone,
        address: data.address,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      } as UserProfile
    },
    enabled: !!userId,
  })
}

/**
 * Hook to create or update user profile
 */
export function useUpdateUserProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      profile,
    }: {
      userId: string
      profile: UserProfileInput
    }) => {
      // Try to get existing profile
      const { data: existing } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', userId)
        .single()

      const profileData = {
        user_id: userId,
        full_name: profile.fullName,
        phone: profile.phone,
        address: profile.address,
        updated_at: new Date().toISOString(),
      }

      if (existing) {
        // Update existing
        const { data, error } = await supabase
          .from('user_profiles')
          .update(profileData)
          .eq('user_id', userId)
          .select()
          .single()

        if (error) throw error
        return data
      } else {
        // Insert new
        const { data, error } = await supabase
          .from('user_profiles')
          .insert(profileData)
          .select()
          .single()

        if (error) throw error
        return data
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: userProfileKeys.byUserId(variables.userId),
      })
    },
  })
}
