import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '#/shared/api/supabase'
import type { Order, OrderItem } from '#/shared/types'

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false })

      if (error) throw error

      return data.map((order) => ({
        id: order.id,
        orderNumber: order.order_number,
        status: order.status as 'draft' | 'pending' | 'completed',
        userId: order.user_id,
        userName: order.user_name,
        notes: order.notes || undefined,
        createdAt: order.created_at,
        submittedAt: order.submitted_at || undefined,
        items: order.order_items.map((item: any) => ({
          materialId: item.material_id,
          code: item.code,
          uv: item.uv || undefined,
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          notes: item.notes || undefined,
        })),
      })) as Order[]
    },
  })
}

export function useCreateOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      userName,
      items,
      notes,
    }: {
      userId: string
      userName: string
      items: OrderItem[]
      notes?: string
    }) => {
      // Generate order number (timestamp-based)
      const orderNumber = `ORD-${Date.now()}`

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          user_id: userId,
          user_name: userName,
          status: 'draft',
          notes: notes || null,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        material_id: item.materialId,
        code: item.code,
        uv: item.uv || null,
        description: item.description,
        quantity: item.quantity,
        unit: item.unit,
        notes: item.notes || null,
      }))

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems)

      if (itemsError) throw itemsError

      return { orderId: order.id, orderNumber }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
