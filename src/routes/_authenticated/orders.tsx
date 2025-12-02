import { useState } from 'react'
import { createFileRoute, useNavigate, useMatches, Outlet } from '@tanstack/react-router'
import { ShoppingCart, Loader2, Package, CheckCircle, Plus } from 'lucide-react'
import { useOrders } from '#/features/orders/hooks/useOrders'
import { OrderHistoryCard } from '#/features/orders/components/OrderHistoryCard'
import { exportToExcel } from '#/features/orders/utils/excelExport'
import { PageHeader } from '#/shared/components/PageHeader'
import { Button } from '#/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/shared/components/ui/card'
import type { Order } from '#/shared/types/material'

export const Route = createFileRoute('/_authenticated/orders')({
  component: OrdersPage,
})

function OrdersPage() {
  const { data: orders, isLoading } = useOrders()
  const navigate = useNavigate()
  const [filter, setFilter] = useState<'all' | 'sent' | 'failed'>('all')
  const matches = useMatches()

  // Check if we're on a child route by examining the route matches
  // If there's a match beyond the /orders route, we're on a child route
  const isChildRoute = matches.some(match => match.routeId === '/_authenticated/orders/new')

  // If we're on a child route, just render the Outlet
  if (isChildRoute) {
    return <Outlet />
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mb-2 mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando pedidos...</p>
        </div>
      </div>
    )
  }

  // Filter orders by status
  const filteredOrders = orders?.filter((order) => {
    if (filter === 'all') return true
    if (filter === 'sent') return order.status === 'sent'
    if (filter === 'failed') return order.status === 'failed'
    return true
  }) || []

  const handleDownloadOrder = (order: Order) => {
    exportToExcel({
      orderNumber: order.orderNumber,
      items: order.items,
    })
  }

  const handleRepeatOrder = (order: Order) => {
    // Navigate to new order creation with pre-filled items
    navigate({
      to: '/orders/new',
      search: { repeatOrderId: order.id },
    })
  }

  const handleNewOrder = () => {
    navigate({ to: '/orders/new' })
  }

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Pedidos"
        subtitle="Historial de pedidos realizados"
        icon={<ShoppingCart className="h-6 w-6" />}
        showBack={false}
        actions={
          <Button onClick={handleNewOrder}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Pedido
          </Button>
        }
      />

      {/* Filters */}
      {orders && orders.length > 0 && (
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todos ({orders.length})
          </Button>
          <Button
            variant={filter === 'sent' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('sent')}
          >
            Enviados ({orders.filter(o => o.status === 'sent').length})
          </Button>
          <Button
            variant={filter === 'failed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('failed')}
          >
            Fallidos ({orders.filter(o => o.status === 'failed').length})
          </Button>
        </div>
      )}

      {/* Orders List */}
      {!orders || orders.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6 text-primary" />
              No hay pedidos
            </CardTitle>
            <CardDescription className="text-center">
              Aún no has realizado ningún pedido
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Package className="mb-4 mx-auto h-24 w-24 text-muted-foreground" />
            <p className="mb-4 text-muted-foreground">
              Cuando realices pedidos aparecerán aquí
            </p>
            <Button onClick={handleNewOrder}>
              <Plus className="mr-2 h-4 w-4" />
              Crear Primer Pedido
            </Button>
          </CardContent>
        </Card>
      ) : filteredOrders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No hay pedidos con el filtro seleccionado
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <OrderHistoryCard
              key={order.id}
              order={order}
              onDownload={() => handleDownloadOrder(order)}
              onRepeat={() => handleRepeatOrder(order)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
