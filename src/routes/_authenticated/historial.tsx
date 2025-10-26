import { createFileRoute } from '@tanstack/react-router'
import { History, Clock } from 'lucide-react'

export const Route = createFileRoute('/_authenticated/historial')({
  component: HistorialPage,
})

function HistorialPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <History className="h-6 w-6" />
          Historial
        </h1>
        <p className="text-sm text-muted-foreground">
          Ver registro de cambios en el inventario
        </p>
      </div>

      <div className="flex min-h-[400px] items-center justify-center rounded-lg border-2 border-dashed">
        <div className="text-center">
          <Clock className="mb-4 mx-auto h-16 w-16 text-muted-foreground" />
          <h3 className="mb-2 text-xl font-semibold">Próximamente</h3>
          <p className="text-sm text-muted-foreground">
            Esta funcionalidad estará disponible pronto
          </p>
        </div>
      </div>
    </div>
  )
}

