import { useState, useEffect } from 'react'
import { MaterialWithStats } from '#/shared/types'
import { Button } from '#/shared/components/ui/button'
import { Input } from '#/shared/components/ui/input'
import { cn } from '#/shared/lib/utils'
import { Minus, Plus, Package, Info, Hash } from 'lucide-react'
import { ImageLightbox } from '#/shared/components/ImageLightbox'

interface ReviewCardProps {
  material: MaterialWithStats
  onConfirm: (newStock: number) => void
  onBack?: () => void
  isFirst: boolean
  isLast: boolean
}

export function ReviewCard({ material, onConfirm, onBack, isFirst, isLast }: ReviewCardProps) {
  // Initialize stock state: if counting by boxes, convert units to boxes for display
  const [stock, setStock] = useState(() => {
    if (material.countMethod === 'boxes' && material.itemsPerBox) {
      return Math.floor(material.currentStock / material.itemsPerBox).toString()
    }
    return material.currentStock.toString()
  })
  const [imageError, setImageError] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  // Sync stock input with current material when it changes
  useEffect(() => {
    if (material.countMethod === 'boxes' && material.itemsPerBox) {
      setStock(Math.floor(material.currentStock / material.itemsPerBox).toString())
    } else {
      setStock(material.currentStock.toString())
    }
  }, [material.id, material.currentStock, material.countMethod, material.itemsPerBox])

  // Reset image error when material changes
  useEffect(() => {
    setImageError(false)
  }, [material.photoUrl])

  const handleConfirm = () => {
    const value = parseFloat(stock)
    if (!isNaN(value) && value >= 0) {
      // Convert boxes to units if counting by boxes
      const unitsToStore = material.countMethod === 'boxes' && material.itemsPerBox
        ? value * material.itemsPerBox
        : value
      onConfirm(unitsToStore)
    }
  }

  const handleIncrement = () => {
    const currentValue = parseFloat(stock) || 0
    // Always increment by 1 (either 1 box or 1 unit)
    setStock((currentValue + 1).toString())
  }

  const handleDecrement = () => {
    const currentValue = parseFloat(stock) || 0
    if (currentValue > 0) {
      // Always decrement by 1 (either 1 box or 1 unit)
      setStock((currentValue - 1).toString())
    }
  }

  const stockValue = parseFloat(stock) || 0
  // Convert to units if counting by boxes
  const stockInUnits = material.countMethod === 'boxes' && material.itemsPerBox
    ? stockValue * material.itemsPerBox
    : stockValue
  const availableSessions = Math.floor(stockInUnits / material.usagePerSession)
  const needsOrder = availableSessions < material.minSessions

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-lg border-2 border-primary bg-card p-4 sm:p-6 shadow-lg">
        {/* Prominent Image Section */}
        <div className="mb-6 sm:mb-8 flex justify-center">
          {material.photoUrl && !imageError ? (
            <div className="relative group cursor-pointer" onClick={() => setIsLightboxOpen(true)}>
              <img
                src={material.photoUrl}
                alt={material.name}
                className="h-48 w-48 sm:h-80 sm:w-80 rounded-lg object-cover border-2 border-border shadow-md transition-opacity group-hover:opacity-90"
                loading="lazy"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="flex h-48 w-48 sm:h-80 sm:w-80 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted">
              <Package className="h-24 w-24 sm:h-40 sm:w-40 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Material Info */}
        <div className="mb-4 sm:mb-6 text-center">
          <h2 className="text-xl sm:text-2xl font-bold">{material.name}</h2>
        </div>

        {/* Descripción del material */}
        {material.description && (
          <div className="mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3 rounded-lg border bg-muted/50 px-3 py-2 sm:px-4 sm:py-3">
            <Info className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <p className="text-xs sm:text-sm text-muted-foreground">
              {material.description}
            </p>
          </div>
        )}

        {/* Input de stock */}
        <div className="mb-3 sm:mb-4">
          <label className="mb-2 block text-sm sm:text-base font-medium text-center">
            {material.countMethod === 'boxes' ? (
              <>
                ¿Cuántas <span className="font-bold text-primary">cajas sin abrir</span> tienes?
              </>
            ) : (
              <>
                ¿Cuántas <span className="font-bold text-primary">unidades</span> tienes actualmente?
              </>
            )}
          </label>
          {material.countMethod === 'boxes' && material.itemsPerBox && (
            <p className="text-xs text-muted-foreground text-center mb-2">
              ({material.itemsPerBox} unidades por caja)
            </p>
          )}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleDecrement}
                disabled={stockValue <= 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                className="text-xl sm:text-2xl text-center font-bold w-28 sm:w-32"
                min="0"
                step={material.countMethod === 'boxes' ? 1 : 0.1}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleIncrement}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              {material.countMethod === 'boxes' ? (
                <>
                  <Package className="h-4 w-4" />
                  cajas
                </>
              ) : (
                <>
                  <Hash className="h-3.5 w-3.5" />
                  {material.unit}
                </>
              )}
            </span>
          </div>
        </div>

        {/* Sesiones disponibles */}
        <div className="mb-4 sm:mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-lg bg-muted px-3 py-2 sm:px-4">
            <span className="text-xs sm:text-sm text-muted-foreground">Sesiones disponibles:</span>
            <span
              className={cn(
                'text-lg sm:text-xl font-bold',
                needsOrder ? 'text-destructive' : 'text-primary'
              )}
            >
              {availableSessions}
            </span>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex gap-3">
          {!isFirst && (
            <Button variant="outline" onClick={onBack} className="flex-1" size="lg">
              ← Anterior
            </Button>
          )}
          <Button
            onClick={handleConfirm}
            className="flex-1"
            size="lg"
            disabled={stock === '' || isNaN(parseFloat(stock))}
          >
            {isLast ? '✓ Finalizar' : 'Siguiente →'}
          </Button>
        </div>
      </div>

      {/* Image Lightbox */}
      {material.photoUrl && !imageError && (
        <ImageLightbox
          open={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          imageUrl={material.photoUrl}
          alt={material.name}
        />
      )}
    </div>
  )
}

