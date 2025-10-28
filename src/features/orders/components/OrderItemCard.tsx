import { Minus, Plus, CheckCircle2 } from 'lucide-react'
import { MaterialWithStats } from '#/shared/types'
import { Button } from '#/shared/components/ui/button'
import { Input } from '#/shared/components/ui/input'
import { cn } from '#/shared/lib/utils'

interface OrderItemCardProps {
  material: MaterialWithStats
  isSelected: boolean
  quantity: number // Número de cajas (o unidades si no hay itemsPerBox)
  onToggle: () => void
  onQuantityChange: (boxes: number) => void
}

export function OrderItemCard({
  material,
  isSelected,
  quantity,
  onToggle,
  onQuantityChange,
}: OrderItemCardProps) {
  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    onQuantityChange(quantity + 1)
  }

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    onQuantityChange(Math.max(0, quantity - 1))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    const value = parseInt(e.target.value) || 0
    onQuantityChange(Math.max(0, value))
  }

  const totalUnits = material.itemsPerBox ? quantity * material.itemsPerBox : quantity

  return (
    <div
      onClick={onToggle}
      className={cn(
        'rounded-lg border p-4 shadow-sm transition-all cursor-pointer relative',
        'hover:shadow-md',
        isSelected
          ? 'bg-primary/10 border-primary border-2'
          : 'bg-card border-border hover:border-primary/50'
      )}
    >
      {/* Check icon - Solo visible cuando está seleccionado */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-10">
          <CheckCircle2 className="h-5 w-5 text-primary fill-primary/20" />
        </div>
      )}

      {/* Desktop: Horizontal layout */}
      <div className="hidden sm:flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold truncate">{material.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <span>
              Stock: {material.currentStock} {material.unit}
            </span>
            <span>•</span>
            <span>Sesiones: {material.availableSessions}</span>
            {material.itemsPerBox && (
              <>
                <span>•</span>
                <span>{material.itemsPerBox} items/caja</span>
              </>
            )}
          </div>
        </div>

        {/* Stepper Desktop */}
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <div className="text-sm text-muted-foreground mr-2">
            {material.itemsPerBox ? 'Cajas:' : 'Cantidad:'}
          </div>
          <Button
            size="icon"
            variant="outline"
            onClick={handleDecrement}
            disabled={quantity === 0}
            className="h-8 w-8"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            value={quantity}
            onChange={handleInputChange}
            onClick={(e) => e.stopPropagation()}
            className="w-16 text-center h-8 bg-background"
            min="0"
          />
          <Button size="icon" variant="outline" onClick={handleIncrement} className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
          {material.itemsPerBox && (
            <div className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
              ({totalUnits} {material.unit})
            </div>
          )}
        </div>
      </div>

      {/* Móvil: Vertical layout */}
      <div className="sm:hidden space-y-3">
        <div>
          <h3 className="font-semibold mb-1">{material.name}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Stock: {material.currentStock}</span>
            <span>|</span>
            <span>Sesiones: {material.availableSessions}</span>
          </div>
          {material.itemsPerBox && (
            <div className="text-sm text-muted-foreground mt-1">
              {material.itemsPerBox} items por caja
            </div>
          )}
        </div>

        {/* Stepper Móvil */}
        <div onClick={(e) => e.stopPropagation()}>
          <div className="text-sm font-medium mb-2">
            {material.itemsPerBox ? 'Cajas a pedir:' : 'Cantidad a pedir:'}
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={handleDecrement}
              disabled={quantity === 0}
              className="h-10 w-10"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              type="number"
              value={quantity}
              onChange={handleInputChange}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 text-center h-10 text-lg font-semibold bg-background"
              min="0"
            />
            <Button size="icon" variant="outline" onClick={handleIncrement} className="h-10 w-10">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          {material.itemsPerBox && (
            <div className="text-xs text-muted-foreground mt-2">
              Total: {totalUnits} {material.unit}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
