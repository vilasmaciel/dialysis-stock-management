import { useState } from 'react'
import { MaterialWithStats } from '#/shared/types'
import { cn } from '#/shared/lib/utils'
import { Button } from '#/shared/components/ui/button'
import { ItemEditor } from '#/features/item-editor/components/ItemEditor'
import styles from './MaterialCard.module.css'

interface MaterialCardProps {
  material: MaterialWithStats
  onClick?: () => void
  showEditButton?: boolean
}

export function MaterialCard({ material, onClick, showEditButton = true }: MaterialCardProps) {
  const statusColor = material.availableSessions >= material.minSessions ? 'green' : 'red'
  const [isEditorOpen, setIsEditorOpen] = useState(false)

  const handleCardClick = () => {
    if (onClick) {
      onClick()
    } else if (showEditButton) {
      setIsEditorOpen(true)
    }
  }

  return (
    <>
      <div
        className={cn(
          styles.card,
          'cursor-pointer rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md',
          (onClick || showEditButton) && 'hover:scale-[1.02]'
        )}
        onClick={handleCardClick}
      >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{material.name}</h3>
            <span
              className={cn(
                'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white',
                statusColor === 'green' ? 'bg-green-500' : 'bg-red-500'
              )}
            >
              {statusColor === 'green' ? '✓' : '!'}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{material.code}</span>
            {material.uv && (
              <>
                <span>•</span>
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{material.uv}</span>
              </>
            )}
          </div>
        </div>
        {material.photoUrl && (
          <img
            src={material.photoUrl}
            alt={material.name}
            className="h-12 w-12 rounded object-cover"
          />
        )}
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Stock actual:</span>
          <span className="font-semibold">
            {material.currentStock} {material.unit}
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Sesiones disponibles:</span>
          <span
            className={cn(
              'font-bold',
              statusColor === 'green' ? 'text-green-600' : 'text-red-600'
            )}
          >
            {material.availableSessions} sesiones
          </span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Uso por sesión:</span>
          <span>{material.usagePerSession} {material.unit}</span>
        </div>
      </div>

      {material.needsOrder && (
        <div className="mt-4 rounded-md bg-red-50 p-2 text-sm text-red-700">
          ⚠️ Se necesita pedir: <strong>{material.unitsToOrder} {material.unit}</strong>
        </div>
      )}

      {material.availableSessions >= material.minSessions && (
        <div className="mt-4 rounded-md bg-green-50 p-2 text-sm text-green-700">
          ✓ Stock suficiente para {material.availableSessions} sesiones
        </div>
      )}

      {showEditButton && (
        <Button
          variant="outline"
          className="mt-4 w-full"
          onClick={(e) => {
            e.stopPropagation()
            setIsEditorOpen(true)
          }}
        >
          ✏️ Editar stock
        </Button>
      )}
    </div>

    <ItemEditor material={material} open={isEditorOpen} onOpenChange={setIsEditorOpen} />
  </>
  )
}
