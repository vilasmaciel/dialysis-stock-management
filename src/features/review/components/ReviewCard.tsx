import { useState } from 'react'
import { MaterialWithStats } from '#/shared/types'
import { Button } from '#/shared/components/ui/button'
import { Input } from '#/shared/components/ui/input'
import { cn } from '#/shared/lib/utils'

interface ReviewCardProps {
  material: MaterialWithStats
  onConfirm: (newStock: number) => void
  onBack?: () => void
  isFirst: boolean
  isLast: boolean
}

export function ReviewCard({ material, onConfirm, onBack, isFirst, isLast }: ReviewCardProps) {
  const [stock, setStock] = useState(material.currentStock.toString())
  const [isEditing, setIsEditing] = useState(false)

  const handleConfirm = () => {
    const value = parseFloat(stock)
    if (!isNaN(value) && value >= 0) {
      onConfirm(value)
      setIsEditing(false)
    }
  }

  const stockValue = parseFloat(stock) || 0
  const availableSessions = Math.floor(stockValue / material.usagePerSession)
  const needsOrder = availableSessions < material.minSessions
  const hasChanges = stockValue !== material.currentStock

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="rounded-lg border-2 border-primary bg-card p-6 shadow-lg">
        {/* Material Info */}
        <div className="mb-6 text-center">
          {material.photoUrl && (
            <img
              src={material.photoUrl}
              alt={material.name}
              className="mx-auto mb-4 h-32 w-32 rounded-lg object-cover"
            />
          )}
          <h2 className="text-2xl font-bold">{material.name}</h2>
          <p className="text-muted-foreground">
            {material.code}
            {material.uv && ` • ${material.uv}`} • Uso: {material.usagePerSession}{' '}
            {material.unit}/sesión
          </p>
        </div>

        {/* Stock anterior */}
        <div className="mb-6 rounded-lg bg-muted p-4">
          <div className="text-sm text-muted-foreground">Stock registrado:</div>
          <div className="text-xl font-semibold">
            {material.currentStock} {material.unit}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            ({material.availableSessions} sesiones disponibles)
          </div>
        </div>

        {/* Input de stock */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium">
            ¿Cuánto stock tienes actualmente?
          </label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              onFocus={() => setIsEditing(true)}
              placeholder="0"
              className="text-2xl text-center font-bold"
              min="0"
              step="0.1"
            />
            <div className="flex items-center px-3 text-lg text-muted-foreground">
              {material.unit}
            </div>
          </div>
        </div>

        {/* Preview del nuevo stock */}
        {isEditing && (
          <div
            className={cn(
              'mb-6 rounded-lg border-2 p-4',
              needsOrder
                ? 'border-destructive bg-muted'
                : hasChanges
                  ? 'border-accent bg-muted'
                  : 'border-primary bg-muted'
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">Sesiones disponibles:</span>
              <span
                className={cn(
                  'text-2xl font-bold',
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
            {hasChanges && !needsOrder && (
              <div className="mt-2 text-sm text-accent">
                ℹ️ El stock cambió de {material.currentStock} a {stockValue} {material.unit}
              </div>
            )}
          </div>
        )}

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
