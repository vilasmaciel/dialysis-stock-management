import { createFileRoute, Link } from '@tanstack/react-router'
import { Package, Edit3, ClipboardCheck, ShoppingCart, BarChart3, Settings } from 'lucide-react'
import { Button } from '#/shared/components/ui/button'
import { useAuth } from '#/shared/contexts/AuthContext'

export const Route = createFileRoute('/_authenticated/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user, signOut } = useAuth()

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Control de Material de Diálisis</h1>
          <p className="text-muted-foreground">
            Bienvenido, {user?.user_metadata?.full_name || user?.email}
          </p>
        </div>
        <Button onClick={() => signOut()} variant="outline">
          Cerrar sesión
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link to="/inventory">
          <div className="cursor-pointer rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-all hover:scale-[1.02] hover:shadow-md">
            <div className="mb-3 flex items-center gap-3">
              <Package className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Inventario</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Ver y gestionar el stock de materiales
            </p>
          </div>
        </Link>

        <div className="cursor-not-allowed rounded-lg border bg-card p-6 text-card-foreground opacity-60 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <Edit3 className="h-6 w-6 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Editar Items</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Actualizar cantidades con botones +1 / -1
          </p>
          <p className="mt-2 text-xs text-yellow-600">Próximamente</p>
        </div>

        <Link to="/review">
          <div className="cursor-pointer rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-all hover:scale-[1.02] hover:shadow-md">
            <div className="mb-3 flex items-center gap-3">
              <ClipboardCheck className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Revisión</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Modo checklist para revisar todo el inventario
            </p>
          </div>
        </Link>

        <Link to="/orders">
          <div className="cursor-pointer rounded-lg border bg-card p-6 text-card-foreground shadow-sm transition-all hover:scale-[1.02] hover:shadow-md">
            <div className="mb-3 flex items-center gap-3">
              <ShoppingCart className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Generar Pedido</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Crear y descargar pedido en formato Excel
            </p>
          </div>
        </Link>

        <div className="cursor-not-allowed rounded-lg border bg-card p-6 text-card-foreground opacity-60 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Historial</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Ver registro de cambios en el inventario
          </p>
          <p className="mt-2 text-xs text-yellow-600">Próximamente</p>
        </div>

        <div className="cursor-not-allowed rounded-lg border bg-card p-6 text-card-foreground opacity-60 shadow-sm">
          <div className="mb-3 flex items-center gap-3">
            <Settings className="h-6 w-6 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Configuración</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Configurar materiales y preferencias
          </p>
          <p className="mt-2 text-xs text-yellow-600">Próximamente</p>
        </div>
      </div>
    </div>
  )
}
