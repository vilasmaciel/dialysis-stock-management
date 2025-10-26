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
}

export function MaterialRow({ material }: MaterialRowProps) {
  const [quantity, setQuantity] = useState(material.currentStock)
  const { user } = useAuth()
  const { mutate: updateStock, isPending } = useUpdateMaterialStock()
  const statusColor = material.availableSessions >= material.minSessions ? 'green' : 'red'

  // Update local quantity when material changes (e.g., after save)
  useEffect(() => {
    setQuantity(material.currentStock)
  }, [material.currentStock])

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
        'flex items-center gap-2 sm:gap-3 rounded-lg border p-2 sm:p-3 transition-colors',
        material.needsOrder
          ? 'bg-destructive/10 border-destructive/30'
          : 'bg-card hover:bg-muted/50'
      )}
    >
      {/* Image/Placeholder */}
      {material.photoUrl ? (
        <img
          src={material.photoUrl}
          alt={material.name}
          className="h-12 w-12 rounded object-cover flex-shrink-0"
        />
      ) : (
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded bg-muted">
          <Package className="h-6 w-6 text-muted-foreground" />
        </div>
      )}

      {/* Material Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm truncate">{material.name}</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
          <span
            className={cn(
              'font-semibold',
              statusColor === 'green' ? 'text-primary' : 'text-destructive'
            )}
          >
            {material.availableSessions} sesiones
          </span>
        </div>
      </div>

      {/* Stock Controls */}
      <div className="flex items-center gap-1 flex-shrink-0">
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
    </div>
  )
}

