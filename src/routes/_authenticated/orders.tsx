import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ShoppingCart, Loader2, ArrowLeft, Package, CheckCircle, FileSpreadsheet, Loader, Mail, Phone } from 'lucide-react'
import { useMaterials } from '#/features/inventory/hooks/useMaterials'
import { useCreateOrder } from '#/features/orders/hooks/useOrders'
import { OrderItemCard } from '#/features/orders/components/OrderItemCard'
import { exportToExcel } from '#/features/orders/utils/excelExport'
import { Button } from '#/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/shared/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '#/shared/components/ui/alert'
import { CopyableEmail } from '#/shared/components/CopyableEmail'
import { useAuth } from '#/shared/contexts/AuthContext'
import type { OrderItem } from '#/shared/types'

export const Route = createFileRoute('/_authenticated/orders')({
  component: OrdersPage,
})

function OrdersPage() {
  const { data: materials, isLoading } = useMaterials()
  const { mutate: createOrder, isPending: isCreatingOrder } = useCreateOrder()
  const { user, signOut } = useAuth()
  const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(new Set())

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

  // Filter materials that need order
  const materialsToOrder = materials?.filter((m) => m.needsOrder) || []

  // Initially select all materials that need order
  if (selectedMaterials.size === 0 && materialsToOrder.length > 0) {
    setSelectedMaterials(new Set(materialsToOrder.map((m) => m.id)))
  }

  const selectedItems = materialsToOrder.filter((m) => selectedMaterials.has(m.id))

  const handleToggleMaterial = (materialId: string) => {
    const newSet = new Set(selectedMaterials)
    if (newSet.has(materialId)) {
      newSet.delete(materialId)
    } else {
      newSet.add(materialId)
    }
    setSelectedMaterials(newSet)
  }

  const handleGenerateOrder = () => {
    if (!user || selectedItems.length === 0) return

    const orderItems: OrderItem[] = selectedItems.map((material) => ({
      materialId: material.id,
      code: material.code,
      uv: material.itemsPerBox ? `C/${material.itemsPerBox}` : undefined,
      description: material.name,
      quantity: material.unitsToOrder,
      unit: material.unit,
    }))

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
            orderDate: new Date().toLocaleDateString('es-ES'),
            userName: user.user_metadata?.full_name || user.email || 'Usuario',
            items: orderItems,
          })

          // Reset selection
          setSelectedMaterials(new Set())
        },
      }
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold">
              <ShoppingCart className="h-6 w-6" />
              Generar Pedido
            </h1>
            <p className="text-sm text-muted-foreground">
              {user?.user_metadata?.full_name || user?.email}
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/dashboard">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
            </Link>
            <Button onClick={() => signOut()} variant="outline">
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
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
            {/* Resumen */}
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
                <CardDescription>
                  {materialsToOrder.length} material{materialsToOrder.length !== 1 ? 'es' : ''} con
                  stock bajo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <div className="text-3xl font-bold text-destructive">{materialsToOrder.length}</div>
                    <div className="text-sm text-destructive">Necesitan pedido</div>
                  </div>
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <div className="text-3xl font-bold text-accent">{selectedItems.length}</div>
                    <div className="text-sm text-accent/80">Seleccionados</div>
                  </div>
                  <div className="rounded-lg bg-muted p-4 text-center">
                    <div className="text-3xl font-bold text-primary">
                      {selectedItems.reduce((sum, m) => sum + m.unitsToOrder, 0).toFixed(0)}
                    </div>
                    <div className="text-sm text-primary">Unidades totales</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de materiales */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Materiales a Pedir</h2>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSelectedMaterials(new Set(materialsToOrder.map((m) => m.id)))
                    }
                  >
                    Seleccionar todos
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setSelectedMaterials(new Set())}>
                    Limpiar selección
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {materialsToOrder.map((material) => (
                  <div key={material.id} className="relative">
                    <input
                      type="checkbox"
                      checked={selectedMaterials.has(material.id)}
                      onChange={() => handleToggleMaterial(material.id)}
                      className="absolute left-4 top-4 h-5 w-5 cursor-pointer"
                    />
                    <div className="pl-12">
                      <OrderItemCard material={material} showRemoveButton={false} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

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
    </div>
  )
}
