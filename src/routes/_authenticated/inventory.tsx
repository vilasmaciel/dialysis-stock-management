import { createFileRoute, Link } from '@tanstack/react-router'
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-2 text-2xl">⏳</div>
          <p className="text-muted-foreground">Cargando inventario...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-2 text-2xl">❌</div>
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
            <h1 className="text-2xl font-bold">📦 Inventario de Materiales</h1>
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
        {lowStockCount > 0 && (
          <div className="mb-6 rounded-lg border-l-4 border-red-500 bg-red-50 p-4">
            <p className="font-semibold text-red-700">
              ⚠️ {lowStockCount} material{lowStockCount !== 1 ? 'es' : ''} con stock bajo
            </p>
            <p className="text-sm text-red-600">
              Estos materiales necesitan ser pedidos pronto
            </p>
          </div>
        )}

        {!materials || materials.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
            <div className="text-center">
              <div className="mb-2 text-4xl">📦</div>
              <h3 className="mb-1 font-semibold">No hay materiales registrados</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Agrega materiales a tu inventario para comenzar
              </p>
              <Button>+ Agregar Material</Button>
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
