import { createFileRoute } from '@tanstack/react-router'
import { History, Clock } from 'lucide-react'
import { PageHeader } from '#/shared/components/PageHeader'

export const Route = createFileRoute('/_authenticated/historial')({
  component: HistorialPage,
})

function HistorialPage() {
  return (
    <div className="container mx-auto p-6">
      <PageHeader
        title="Historial"
        subtitle="Ver registro de cambios en el inventario"
        icon={<History className="h-6 w-6" />}
        showBack={true}
        backTo="/dashboard"
      />

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

