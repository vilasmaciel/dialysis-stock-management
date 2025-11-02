import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ShoppingCart, Loader2, Package, CheckCircle, FileSpreadsheet, Loader, Mail, Phone, Hospital } from 'lucide-react'
import { useMaterials } from '#/features/inventory/hooks/useMaterials'
import { useCreateOrder } from '#/features/orders/hooks/useOrders'
import { OrderItemCard } from '#/features/orders/components/OrderItemCard'
import { exportToExcel } from '#/features/orders/utils/excelExport'
import { PageHeader } from '#/shared/components/PageHeader'
import { Button } from '#/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/shared/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '#/shared/components/ui/alert'
import { CopyableEmail } from '#/shared/components/CopyableEmail'
import { useAuth } from '#/shared/contexts/AuthContext'
import type { OrderItem, MaterialWithStats } from '#/shared/types'

export const Route = createFileRoute('/_authenticated/orders')({
  component: OrdersPage,
})

/**
 * Calcula el número inicial de cajas a pedir para un material
 */
function calculateInitialBoxes(material: MaterialWithStats): number {
  if (!material.itemsPerBox) {
    return material.unitsToOrder
  }
  return Math.ceil(material.unitsToOrder / material.itemsPerBox)
}

function OrdersPage() {
  const { data: materials, isLoading } = useMaterials()
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder()
  const { user } = useAuth()
  const [orderQuantities, setOrderQuantities] = useState<Map<string, number>>(new Map())

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mb-2 mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando materiales...</p>
        </div>
      </div>
    )
  }

  // Filter materials that need order - separate by hospital pickup
  const materialsToOrder = materials?.filter((m) => m.needsOrder && !m.hospitalPickup) || []
  const hospitalMaterials = materials?.filter((m) => m.needsOrder && m.hospitalPickup) || []

  // Initially select all materials with calculated quantities
  if (orderQuantities.size === 0 && materialsToOrder.length > 0) {
    const initialQuantities = new Map<string, number>()
    materialsToOrder.forEach((material) => {
      initialQuantities.set(material.id, calculateInitialBoxes(material))
    })
    setOrderQuantities(initialQuantities)
  }

  // Selected items are those with quantity > 0
  const selectedItems = materialsToOrder.filter(
    (m) => orderQuantities.has(m.id) && (orderQuantities.get(m.id) || 0) > 0
  )

  const handleToggleMaterial = (materialId: string) => {
    const newQuantities = new Map(orderQuantities)
    if (newQuantities.has(materialId) && (newQuantities.get(materialId) || 0) > 0) {
      // Deselect: set quantity to 0
      newQuantities.set(materialId, 0)
    } else {
      // Select: set to initial calculated quantity
      const material = materialsToOrder.find((m) => m.id === materialId)
      if (material) {
        newQuantities.set(materialId, calculateInitialBoxes(material))
      }
    }
    setOrderQuantities(newQuantities)
  }

  const handleQuantityChange = (materialId: string, boxes: number) => {
    const newQuantities = new Map(orderQuantities)
    newQuantities.set(materialId, Math.max(0, boxes))
    setOrderQuantities(newQuantities)
  }

  const handleGenerateOrder = () => {
    if (!user || selectedItems.length === 0) return

    // Convert Map entries to OrderItems, converting boxes to units
    const orderItems: OrderItem[] = Array.from(orderQuantities.entries())
      .filter(([_, boxes]) => boxes > 0)
      .map(([materialId, boxes]) => {
        const material = materialsToOrder.find((m) => m.id === materialId)!
        const units = material.itemsPerBox ? boxes * material.itemsPerBox : boxes
        return {
          materialId,
          code: material.code,
          uv: material.itemsPerBox ? `C/${material.itemsPerBox}` : undefined,
          description: material.name,
          quantity: units,
          unit: material.unit,
        }
      })

    // Create order in database
    createOrder(
      {
        userId: user.id,
        userName: user.user_metadata?.full_name || user.email || 'Usuario',
        items: orderItems,
        notes: 'Pedido generado automáticamente desde la aplicación',
      },
      {
        onSuccess: ({ orderNumber }) => {
          // Export to Excel
          exportToExcel({
            orderNumber,
            items: orderItems,
          })

          // Reset quantities
          setOrderQuantities(new Map())
        },
      }
    )
  }

  const handleSelectAll = () => {
    const newQuantities = new Map<string, number>()
    materialsToOrder.forEach((material) => {
      newQuantities.set(material.id, calculateInitialBoxes(material))
    })
    setOrderQuantities(newQuantities)
  }

  const handleClearSelection = () => {
    setOrderQuantities(new Map())
  }

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Generar Pedido"
        subtitle={user?.user_metadata?.full_name || user?.email}
        icon={<ShoppingCart className="h-6 w-6" />}
        showBack={false}
      />

      {/* Contact Info Card */}
      <Alert className="mb-6 border-accent bg-accent/5">
        <Mail className="h-4 w-4" />
        <AlertTitle className="mb-2">Enviar Pedido</AlertTitle>
        <AlertDescription className="space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <CopyableEmail email="hemodialisisencasa@palex.es" showIcon={false} />
            <a
              href="tel:900180135"
              className="inline-flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors group"
            >
              <Phone className="h-4 w-4" />
              <span className="font-medium group-hover:underline">900 180 135</span>
            </a>
          </div>
        </AlertDescription>
      </Alert>

      {materialsToOrder.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-center gap-2">
              <CheckCircle className="h-6 w-6 text-primary" />
              Todo en orden
            </CardTitle>
            <CardDescription className="text-center">
              Todos los materiales tienen stock suficiente
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Package className="mb-4 mx-auto h-24 w-24 text-muted-foreground" />
            <p className="mb-4 text-muted-foreground">
              No hay materiales que necesiten ser pedidos en este momento
            </p>
            <Link to="/dashboard">
              <Button>Ver Inventario</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Resumen - Solo visible en Desktop */}
          <Card className="hidden sm:block">
            <CardHeader>
              <CardTitle>Resumen del Pedido</CardTitle>
              <CardDescription>
                {materialsToOrder.length} material{materialsToOrder.length !== 1 ? 'es' : ''} con
                stock bajo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-muted p-4 text-center">
                  <div className="text-3xl font-bold text-destructive">{materialsToOrder.length}</div>
                  <div className="text-sm text-destructive">Necesitan pedido</div>
                </div>
                <div className="rounded-lg bg-muted p-4 text-center">
                  <div className="text-3xl font-bold text-accent">{selectedItems.length}</div>
                  <div className="text-sm text-accent/80">Seleccionados</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lista de materiales */}
          <div>
            {/* Resumen compacto - Solo visible en Móvil */}
            <div className="mb-4 sm:hidden">
              <p className="text-sm text-muted-foreground text-center">
                {materialsToOrder.length} material{materialsToOrder.length !== 1 ? 'es' : ''} necesitan pedido
                {' • '}
                <span className="font-medium text-foreground">
                  {selectedItems.length} seleccionado{selectedItems.length !== 1 ? 's' : ''}
                </span>
              </p>
            </div>

            <div className="mb-4">
              {/* Título + Botones Desktop */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-semibold">Materiales a Pedir</h2>
                <div className="hidden sm:flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    Seleccionar todos
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleClearSelection}>
                    Limpiar selección
                  </Button>
                </div>
              </div>

              {/* Botones Móvil */}
              <div className="flex sm:hidden gap-2 mb-3">
                <Button variant="outline" size="sm" onClick={handleSelectAll} className="flex-1">
                  Seleccionar todos
                </Button>
                <Button variant="outline" size="sm" onClick={handleClearSelection} className="flex-1">
                  Limpiar
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {materialsToOrder.map((material) => (
                <OrderItemCard
                  key={material.id}
                  material={material}
                  isSelected={(orderQuantities.get(material.id) || 0) > 0}
                  quantity={orderQuantities.get(material.id) || 0}
                  onToggle={() => handleToggleMaterial(material.id)}
                  onQuantityChange={(boxes) => handleQuantityChange(material.id, boxes)}
                />
              ))}
            </div>
          </div>

          {/* Hospital Pickup Materials Section */}
          {hospitalMaterials.length > 0 && (
            <Card className="border-orange-200 bg-orange-50/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hospital className="h-5 w-5 text-orange-600" />
                  Materiales para recoger en el hospital
                </CardTitle>
                <CardDescription>
                  Estos materiales no se incluyen en el pedido al proveedor. 
                  Deben recogerse directamente en el hospital.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {hospitalMaterials.map((material) => (
                  <div key={material.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div>
                      <p className="font-medium">{material.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Stock: {material.currentStock} {material.unit} • 
                        Sesiones: {material.availableSessions} / {material.minSessions}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-orange-600">
                        Recoger en hospital
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Botón de acción */}
          {selectedItems.length > 0 && (
            <Card className="border-2 border-primary">
              <CardContent className="pt-6">
                <Button
                  onClick={handleGenerateOrder}
                  disabled={isCreatingOrder}
                  size="lg"
                  className="w-full"
                >
                  {isCreatingOrder ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Generando pedido...
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Generar Pedido y Descargar Excel ({selectedItems.length}{' '}
                      {selectedItems.length === 1 ? 'item' : 'items'})
                    </>
                  )}
                </Button>
                <p className="mt-2 text-center text-sm text-muted-foreground">
                  Se creará un pedido en el sistema y se descargará un archivo Excel
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
