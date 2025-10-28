import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Loader2, AlertCircle, PackageX, Plus, AlertTriangle, ClipboardCheck, ShoppingCart } from 'lucide-react'
import { useMaterials } from '#/features/inventory/hooks/useMaterials'
import { MaterialRow } from '#/features/inventory/components/MaterialRow/MaterialRow'
import { MaterialDetailSheet } from '#/features/inventory/components/MaterialDetailSheet/MaterialDetailSheet'
import { PageHeader } from '#/shared/components/PageHeader'
import { Button } from '#/shared/components/ui/button'
import { Alert, AlertTitle } from '#/shared/components/ui/alert'
import type { MaterialWithStats } from '#/shared/types/material'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { data: materials, isLoading, error } = useMaterials()
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialWithStats | null>(null)
  const [detailSheetOpen, setDetailSheetOpen] = useState(false)

  const handleOpenDetail = (material: MaterialWithStats) => {
    setSelectedMaterial(material)
    setDetailSheetOpen(true)
  }

  const handleCloseDetail = () => {
    setDetailSheetOpen(false)
    // Small delay before clearing to allow sheet animation to complete
    setTimeout(() => setSelectedMaterial(null), 300)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader2 className="mb-4 mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Cargando inventario...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center">
            <AlertCircle className="mb-2 mx-auto h-10 w-10 text-red-600" />
            <p className="text-red-600">Error al cargar el inventario</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  const lowStockCount = materials?.filter((m) => m.needsOrder).length || 0

  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Inventario de Materiales"
        subtitle="Gestiona el stock de materiales de diálisis"
        actions={
          <div className="hidden sm:flex gap-2">
            <Link to="/review">
              <Button variant="outline">
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Registrar Stock
              </Button>
            </Link>
            <Link to="/orders">
              <Button variant="default">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Generar Pedido
              </Button>
            </Link>
          </div>
        }
      />

      {/* Low Stock Alert */}
      {lowStockCount > 0 && (
        <Alert variant="destructive" className="mb-6 border-l-4 bg-destructive/10 flex items-center [&>svg]:relative [&>svg]:top-0 [&>svg]:left-0 [&>svg~*]:pl-2">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-base font-semibold mb-0">
            {lowStockCount} material{lowStockCount !== 1 ? 'es' : ''} con stock bajo
          </AlertTitle>
        </Alert>
      )}

      {/* Materials List */}
      {!materials || materials.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
          <div className="text-center">
            <PackageX className="mb-2 mx-auto h-16 w-16 text-muted-foreground" />
            <h3 className="mb-1 font-semibold">No hay materiales registrados</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Agrega materiales a tu inventario para comenzar
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Material
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {materials.map((material) => (
            <MaterialRow
              key={material.id}
              material={material}
              onOpenDetail={() => handleOpenDetail(material)}
            />
          ))}
        </div>
      )}

      {/* Material Detail Sheet */}
      <MaterialDetailSheet
        material={selectedMaterial}
        open={detailSheetOpen}
        onClose={handleCloseDetail}
      />
    </div>
  )
}
