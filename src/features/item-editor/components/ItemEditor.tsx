import { useState } from 'react'
import { MaterialWithStats } from '#/shared/types'
import { Button } from '#/shared/components/ui/button'
import { Input } from '#/shared/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/shared/components/ui/dialog'
import { useUpdateMaterialStock } from '#/features/inventory/hooks/useMaterials'
import { useAuth } from '#/shared/contexts/AuthContext'
import { cn } from '#/shared/lib/utils'

interface ItemEditorProps {
  material: MaterialWithStats
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ItemEditor({ material, open, onOpenChange }: ItemEditorProps) {
  const [quantity, setQuantity] = useState(material.currentStock)
  const [customValue, setCustomValue] = useState('')
  const [isEditingCustom, setIsEditingCustom] = useState(false)
  const { mutate: updateStock, isPending } = useUpdateMaterialStock()
  const { user } = useAuth()

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1)
  }

  const handleDecrement = () => {
    setQuantity((prev) => Math.max(0, prev - 1))
  }

  const handleCustomEdit = () => {
    setCustomValue(quantity.toString())
    setIsEditingCustom(true)
  }

  const handleCustomSave = () => {
    const value = parseFloat(customValue)
    if (!isNaN(value) && value >= 0) {
      setQuantity(value)
    }
    setIsEditingCustom(false)
  }

  const handleSave = () => {
    if (!user) return

    updateStock(
      {
        materialId: material.id,
        newStock: quantity,
        userId: user.id,
        userName: user.user_metadata?.full_name || user.email || 'Usuario',
        changeType: 'manual',
        notes: `Actualización manual desde ${material.currentStock} a ${quantity}`,
      },
      {
        onSuccess: () => {
          onOpenChange(false)
        },
      }
    )
  }

  const hasChanges = quantity !== material.currentStock
  const newAvailableSessions = Math.floor(quantity / material.usagePerSession)
  const needsOrder = newAvailableSessions < material.minSessions

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{material.name}</DialogTitle>
          <DialogDescription>
            {material.code}
            {material.uv && ` • ${material.uv}`} • {material.unit}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Stock Info */}
          <div className="rounded-lg border bg-muted p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Stock actual:</span>
              <span className="text-lg font-semibold">
                {material.currentStock} {material.unit}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Sesiones disponibles:</span>
              <span
                className={cn(
                  'font-bold',
                  material.availableSessions >= material.minSessions
                    ? 'text-primary'
                    : 'text-destructive'
                )}
              >
                {material.availableSessions}
              </span>
            </div>
          </div>

          {/* Quantity Editor */}
          <div className="space-y-4">
            <div className="text-center text-sm font-medium">Nuevo stock</div>

            {!isEditingCustom ? (
              <>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleDecrement}
                    disabled={quantity <= 0}
                    className="h-16 w-16 text-2xl"
                  >
                    -1
                  </Button>

                  <div className="flex h-20 w-32 items-center justify-center rounded-lg border-2 border-primary bg-background text-center">
                    <span className="text-3xl font-bold">{quantity}</span>
                  </div>

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleIncrement}
                    className="h-16 w-16 text-2xl"
                  >
                    +1
                  </Button>
                </div>

                <div className="text-center">
                  <Button variant="ghost" size="sm" onClick={handleCustomEdit}>
                    ✏️ Editar cantidad
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Input
                  type="number"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCustomSave()}
                  placeholder="Ingresa cantidad"
                  className="text-center text-xl"
                  autoFocus
                  min="0"
                  step="0.1"
                />
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setIsEditingCustom(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button onClick={handleCustomSave} className="flex-1">
                    Guardar
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* New Stock Preview */}
          {hasChanges && (
            <div className={cn('rounded-lg border-2 p-4', needsOrder ? 'border-destructive bg-muted' : 'border-primary bg-muted')}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Nuevo stock:</span>
                <span className="text-lg font-bold">
                  {quantity} {material.unit}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-medium">Sesiones disponibles:</span>
                <span className={cn('font-bold', needsOrder ? 'text-destructive' : 'text-primary')}>
                  {newAvailableSessions}
                </span>
              </div>
              {needsOrder && (
                <div className="mt-2 text-sm text-destructive">
                  ⚠️ El stock está por debajo del mínimo de {material.minSessions} sesiones
                </div>
              )}
            </div>
          )}

          {/* Usage Info */}
          <div className="text-center text-sm text-muted-foreground">
            Uso por sesión: {material.usagePerSession} {material.unit}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges || isPending}>
            {isPending ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
