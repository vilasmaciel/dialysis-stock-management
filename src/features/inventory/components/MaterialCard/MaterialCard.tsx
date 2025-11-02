import { useState, useEffect } from 'react'
import { CheckCircle2, AlertCircle, AlertTriangle, Edit, Package } from 'lucide-react'
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
  // Determine status color based on session thresholds
  const statusColor =
    material.availableSessions < 6 ? 'red' :
    material.availableSessions < material.maxSessions ? 'yellow' :
    'green'

  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Reset image error when material changes
  useEffect(() => {
    setImageError(false)
  }, [material.photoUrl])

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
      <div className="flex items-start gap-3">
        {material.photoUrl && !imageError ? (
          <img
            src={material.photoUrl}
            alt={material.name}
            className="h-16 w-16 rounded object-cover"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded bg-muted">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{material.name}</h3>
            <span
              className={cn(
                'inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white',
                statusColor === 'green' ? 'bg-primary' :
                statusColor === 'yellow' ? 'bg-yellow-500' :
                'bg-destructive'
              )}
            >
              {statusColor === 'green' ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : statusColor === 'yellow' ? (
                <AlertTriangle className="h-3 w-3" />
              ) : (
                <AlertCircle className="h-3 w-3" />
              )}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{material.code}</span>
            {material.itemsPerBox && (
              <>
                <span>•</span>
                <span className="rounded bg-gray-100 px-2 py-0.5 text-xs">{material.itemsPerBox} items/caja</span>
              </>
            )}
          </div>
        </div>
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
              statusColor === 'green' ? 'text-primary' :
              statusColor === 'yellow' ? 'text-yellow-600' :
              'text-destructive'
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
        <div className="mt-4 flex items-center gap-2 rounded-md bg-muted p-2 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4" />
          <span>
            Se necesita pedir: {material.itemsPerBox && material.boxesToOrder > 0 ? (
              <strong>{material.boxesToOrder} cajas ({material.unitsToOrder} {material.unit})</strong>
            ) : (
              <strong>{material.unitsToOrder} {material.unit}</strong>
            )}
          </span>
        </div>
      )}

      {statusColor === 'green' && (
        <div className="mt-4 flex items-center gap-2 rounded-md bg-muted p-2 text-sm text-primary">
          <CheckCircle2 className="h-4 w-4" />
          <span>Stock óptimo para {material.availableSessions} sesiones</span>
        </div>
      )}

      {statusColor === 'yellow' && (
        <div className="mt-4 flex items-center gap-2 rounded-md bg-yellow-50 border border-yellow-200 p-2 text-sm text-yellow-700">
          <AlertTriangle className="h-4 w-4" />
          <span>Stock por debajo del óptimo ({material.availableSessions}/{material.maxSessions} sesiones)</span>
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
          <>
            <Edit className="mr-2 h-4 w-4" />
            Editar stock
          </>
        </Button>
      )}
    </div>

    <ItemEditor material={material} open={isEditorOpen} onOpenChange={setIsEditorOpen} />
  </>
  )
}
