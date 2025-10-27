import { useState, useEffect } from 'react'
import { MaterialWithStats } from '#/shared/types'
import { Button } from '#/shared/components/ui/button'
import { Input } from '#/shared/components/ui/input'
import { cn } from '#/shared/lib/utils'
import { Minus, Plus, Package, Info } from 'lucide-react'

interface ReviewCardProps {
  material: MaterialWithStats
  onConfirm: (newStock: number) => void
  onBack?: () => void
  isFirst: boolean
  isLast: boolean
}

export function ReviewCard({ material, onConfirm, onBack, isFirst, isLast }: ReviewCardProps) {
  const [stock, setStock] = useState(material.currentStock.toString())

  // Sync stock input with current material when it changes
  useEffect(() => {
    setStock(material.currentStock.toString())
  }, [material.id, material.currentStock])

  const handleConfirm = () => {
    const value = parseFloat(stock)
    if (!isNaN(value) && value >= 0) {
      onConfirm(value)
    }
  }

  const handleIncrement = () => {
    const currentValue = parseFloat(stock) || 0
    setStock((currentValue + 1).toString())
  }

  const handleDecrement = () => {
    const currentValue = parseFloat(stock) || 0
    if (currentValue > 0) {
      setStock((currentValue - 1).toString())
    }
  }

  const stockValue = parseFloat(stock) || 0
  const availableSessions = Math.floor(stockValue / material.usagePerSession)
  const needsOrder = availableSessions < material.minSessions

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-lg border-2 border-primary bg-card p-6 shadow-lg">
        {/* Material Info */}
        <div className="mb-6 text-center">
          {material.photoUrl ? (
            <img
              src={material.photoUrl}
              alt={material.name}
              className="mx-auto mb-4 h-32 w-32 rounded-lg object-cover"
            />
          ) : (
            <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-lg bg-muted">
              <Package className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
          <h2 className="text-2xl font-bold">{material.name}</h2>
          <p className="text-muted-foreground">
            {material.code}
            {material.itemsPerBox && ` • ${material.itemsPerBox} items/caja`} • Uso: {material.usagePerSession}{' '}
            {material.unit}/sesión
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Stock actual: {material.currentStock} {material.unit}
          </p>
        </div>

        {/* Descripción del material */}
        {material.description && (
          <div className="mb-4 flex items-center gap-3 rounded-lg border bg-muted/50 px-4 py-3">
            <Info className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {material.description}
            </p>
          </div>
        )}

        {/* Input de stock */}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium">
            ¿Cuánto stock tienes actualmente?
          </label>
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
                className="text-2xl text-center font-bold w-32"
                min="0"
                step="0.1"
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
            <span className="text-sm text-muted-foreground">{material.unit}</span>
          </div>
        </div>

        {/* Sesiones disponibles */}
        <div className="mb-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
            <span className="text-sm text-muted-foreground">Sesiones disponibles:</span>
            <span
              className={cn(
                'text-xl font-bold',
                needsOrder ? 'text-destructive' : 'text-primary'
              )}
            >
              {availableSessions}
            </span>
          </div>
          {needsOrder && (
            <div className="mt-2 text-sm text-destructive">
              ⚠️ Stock bajo! Mínimo recomendado: {material.minSessions} sesiones
            </div>
          )}
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
    </div>
  )
}
