import { createFileRoute, Link } from '@tanstack/react-router'
import { Package, ArrowLeft, Loader2, AlertCircle, PackageX, Plus, AlertTriangle } from 'lucide-react'
import { useMaterials } from '#/features/inventory/hooks/useMaterials'
import { MaterialCard } from '#/features/inventory/components/MaterialCard/MaterialCard'
import { Button } from '#/shared/components/ui/button'
import { useAuth } from '#/shared/contexts/AuthContext'

export const Route = createFileRoute('/_authenticated/inventory')({
  component: InventoryPage,
})

function InventoryPage() {
  const { data: materials, isLoading, error } = useMaterials()
  const { user, signOut } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto flex items-center justify-between p-4">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold">
                <Package className="h-6 w-6" />
                Inventario de Materiales
              </h1>
              <p className="text-sm text-muted-foreground">
                {user?.user_metadata?.full_name || user?.email}
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/dashboard">
                <Button variant="ghost">← Volver</Button>
              </Link>
              <Button onClick={() => signOut()} variant="outline">
                Cerrar sesión
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="mb-4 mx-auto h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">Cargando inventario...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mb-2 mx-auto h-10 w-10 text-red-600" />
          <p className="text-red-600">Error al cargar el inventario</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  const lowStockCount = materials?.filter((m) => m.needsOrder).length || 0

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold">
              <Package className="h-6 w-6" />
              Inventario de Materiales
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
        {lowStockCount > 0 && (
          <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
            <p className="font-semibold text-red-700">
              <span className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                {lowStockCount} material{lowStockCount !== 1 ? 'es' : ''} con stock bajo
              </span>
            </p>
            <p className="text-sm text-red-600">
              Estos materiales necesitan ser pedidos pronto
            </p>
          </div>
        )}

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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {materials.map((material) => (
              <MaterialCard key={material.id} material={material} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
