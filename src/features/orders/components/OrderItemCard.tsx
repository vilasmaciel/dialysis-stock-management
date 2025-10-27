import { MaterialWithStats } from '#/shared/types'
import { Button } from '#/shared/components/ui/button'

interface OrderItemCardProps {
  material: MaterialWithStats
  onRemove?: () => void
  showRemoveButton?: boolean
}

export function OrderItemCard({ material, onRemove, showRemoveButton = true }: OrderItemCardProps) {
  return (
    <div className="flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{material.name}</h3>
          <span className="inline-flex rounded-full bg-muted px-2 py-1 text-xs font-bold text-destructive">
            Stock bajo
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
        <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-muted-foreground">Stock actual:</span>
            <span className="ml-1 font-medium">
              {material.currentStock} {material.unit}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Sesiones:</span>
            <span className="ml-1 font-bold text-destructive">{material.availableSessions}</span>
          </div>
        </div>
      </div>

      <div className="ml-4 text-right">
        <div className="text-sm text-muted-foreground">A pedir</div>
        {material.itemsPerBox && material.boxesToOrder > 0 ? (
          <>
            <div className="text-2xl font-bold text-primary">
              {material.boxesToOrder} cajas
            </div>
            <div className="text-sm text-muted-foreground">
              ({material.unitsToOrder} {material.unit})
            </div>
          </>
        ) : (
          <>
            <div className="text-2xl font-bold text-primary">
              {material.unitsToOrder}
            </div>
            <div className="text-sm text-muted-foreground">{material.unit}</div>
          </>
        )}
        {showRemoveButton && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="mt-2 text-destructive hover:text-destructive/80"
          >
            Quitar
          </Button>
        )}
      </div>
    </div>
  )
}
