import { useState, useEffect } from 'react'
import { Package, Minus, Plus } from 'lucide-react'
import { MaterialWithStats } from '#/shared/types'
import { cn } from '#/shared/lib/utils'
import { Button } from '#/shared/components/ui/button'
import { Input } from '#/shared/components/ui/input'
import { useUpdateMaterialStock } from '#/features/inventory/hooks/useMaterials'
import { useAuth } from '#/shared/contexts/AuthContext'

interface MaterialRowProps {
  material: MaterialWithStats
  onOpenDetail?: () => void
}

export function MaterialRow({ material, onOpenDetail }: MaterialRowProps) {
  const [quantity, setQuantity] = useState(material.currentStock)
  const [imageError, setImageError] = useState(false)
  const { user } = useAuth()
  const { mutate: updateStock, isPending } = useUpdateMaterialStock()

  // Determine status color based on session thresholds
  const statusColor =
    material.availableSessions < 6 ? 'red' :
    material.availableSessions < material.maxSessions ? 'yellow' :
    'green'

  // Update local quantity when material changes (e.g., after save)
  useEffect(() => {
    setQuantity(material.currentStock)
  }, [material.currentStock])

  // Reset image error when material changes
  useEffect(() => {
    setImageError(false)
  }, [material.photoUrl])

  const handleIncrement = () => {
    const newQuantity = quantity + 1
    setQuantity(newQuantity)
    saveStock(newQuantity)
  }

  const handleDecrement = () => {
    if (quantity <= 0) return
    const newQuantity = Math.max(0, quantity - 1)
    setQuantity(newQuantity)
    saveStock(newQuantity)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (!isNaN(value) && value >= 0) {
      setQuantity(value)
    }
  }

  const handleInputBlur = () => {
    if (quantity !== material.currentStock) {
      saveStock(quantity)
    }
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
  }

  const saveStock = (newStock: number) => {
    if (!user || newStock === material.currentStock) return

    updateStock({
      materialId: material.id,
      newStock,
      userId: user.id,
      userName: user.user_metadata?.full_name || user.email || 'Usuario',
      changeType: 'manual',
      notes: `Actualización desde ${material.currentStock} a ${newStock}`,
    })
  }

  return (
    <div
      className={cn(
        'rounded-lg border p-2 sm:p-3 transition-colors',
        statusColor === 'red'
          ? 'bg-destructive/10 border-destructive/30'
          : statusColor === 'yellow'
          ? 'bg-yellow-50 border-yellow-200 hover:bg-yellow-50/80'
          : 'bg-card hover:bg-muted/50'
      )}
    >
      {/* Desktop layout: horizontal */}
      <div className="hidden sm:flex items-center gap-3">
        {/* Clickable area: Image + Material Info */}
        <div
          className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
          onClick={onOpenDetail}
        >
          {/* Image/Placeholder */}
          {material.photoUrl && !imageError ? (
            <img
              src={material.photoUrl}
              alt={material.name}
              className="h-24 w-24 rounded object-cover flex-shrink-0"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded bg-muted">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
          )}

          {/* Material Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">{material.name}</h3>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
              <span
                className={cn(
                  'font-semibold',
                  statusColor === 'green' ? 'text-primary' :
                  statusColor === 'yellow' ? 'text-yellow-600' :
                  'text-destructive'
                )}
              >
                {material.availableSessions} sesiones
              </span>
            </div>

            {/* Description - Always visible */}
            {material.description && (
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {material.description}
              </p>
            )}
          </div>
        </div>

        {/* Stock Controls (not clickable for detail) */}
        <div className="flex flex-col items-center gap-0.5 flex-shrink-0">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleDecrement}
              disabled={quantity <= 0 || isPending}
            >
              <Minus className="h-3 w-3" />
            </Button>

            <Input
              type="number"
              value={quantity}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              className="h-8 w-16 text-center text-sm p-1"
              disabled={isPending}
              min="0"
              step="1"
            />

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleIncrement}
              disabled={isPending}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <span className="text-sm text-muted-foreground">{material.unit}</span>
        </div>
      </div>

      {/* Mobile layout: vertical */}
      <div className="sm:hidden space-y-2">
        {/* Clickable area: Header with image and name + Description */}
        <div className="space-y-2 cursor-pointer" onClick={onOpenDetail}>
          {/* Header with image and name */}
          <div className="flex items-center gap-2">
            {/* Image/Placeholder */}
            {material.photoUrl && !imageError ? (
              <img
                src={material.photoUrl}
                alt={material.name}
                className="h-24 w-24 rounded object-cover flex-shrink-0"
                loading="lazy"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded bg-muted">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
            )}

            {/* Material Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base">{material.name}</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                <span
                  className={cn(
                    'font-semibold',
                    statusColor === 'green' ? 'text-primary' :
                    statusColor === 'yellow' ? 'text-yellow-600' :
                    'text-destructive'
                  )}
                >
                  {material.availableSessions} sesiones
                </span>
              </div>
            </div>
          </div>

          {/* Description - Always visible - Mobile */}
          {material.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {material.description}
            </p>
          )}
        </div>

        {/* Stock Controls - Full width (not clickable for detail) */}
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleDecrement}
              disabled={quantity <= 0 || isPending}
            >
              <Minus className="h-3 w-3" />
            </Button>

            <Input
              type="number"
              value={quantity}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              onKeyDown={handleInputKeyDown}
              className="h-8 w-16 text-center text-sm p-1"
              disabled={isPending}
              min="0"
              step="1"
            />

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={handleIncrement}
              disabled={isPending}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <span className="text-sm text-muted-foreground">{material.unit}</span>
        </div>
      </div>
    </div>
  )
}

