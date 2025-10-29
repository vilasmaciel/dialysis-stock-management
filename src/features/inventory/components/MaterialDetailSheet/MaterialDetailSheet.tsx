import { useState, useEffect } from 'react'
import { Package, Info } from 'lucide-react'
import type { MaterialWithStats } from '#/shared/types/material'
import { Button } from '#/shared/components/ui/button'
import { Badge } from '#/shared/components/ui/badge'
import { Separator } from '#/shared/components/ui/separator'
import { Card, CardContent } from '#/shared/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '#/shared/components/ui/dialog'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '#/shared/components/ui/sheet'
import { useIsDesktop } from '#/shared/hooks/useMediaQuery'
import { cn } from '#/shared/lib/utils'

interface MaterialDetailSheetProps {
  material: MaterialWithStats | null
  open: boolean
  onClose: () => void
}

function MaterialDetailContent({ material }: { material: MaterialWithStats }) {
  const [imageError, setImageError] = useState(false)

  // Reset image error when material changes
  useEffect(() => {
    setImageError(false)
  }, [material.photoUrl])
  return (
    <div className="space-y-6 py-4">
      {/* Primary Section: Photo + Key Specifications (Two-column grid) */}
      <div className="grid sm:grid-cols-[160px_1fr] gap-6 items-start">
        {/* Photo */}
        <div className="flex justify-center sm:justify-start">
          {material.photoUrl && !imageError ? (
            <img
              src={material.photoUrl}
              alt={material.name}
              className="h-32 w-32 sm:h-40 sm:w-40 rounded-lg object-cover border"
              loading="lazy"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex h-32 w-32 sm:h-40 sm:w-40 items-center justify-center rounded-lg border bg-muted">
              <Package className="h-16 w-16 sm:h-20 sm:w-20 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* Key Specifications */}
        <div className="space-y-3">
          {/* Items per Box */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Presentación
            </p>
            <div className="flex items-baseline gap-2">
              {material.itemsPerBox ? (
                <>
                  <p className="text-xl font-semibold text-foreground">
                    {material.itemsPerBox} items
                  </p>
                  <span className="text-sm text-muted-foreground">por caja</span>
                </>
              ) : (
                <p className="text-sm text-muted-foreground italic">No especificado</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Consumption per Session */}
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
              Consumo por sesión
            </p>
            <p className="text-xl font-semibold text-foreground">
              {material.usagePerSession} {material.unit}
            </p>
          </div>
        </div>
      </div>

      {/* Description (if exists) - Elevated to Card */}
      {material.description && (
        <>
          <Separator />
          <Card className="border-l-4 border-l-primary/50">
            <CardContent className="pt-4">
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-primary" />
                Descripción
              </h4>
              <p className="text-sm text-foreground leading-relaxed">
                {material.description}
              </p>
            </CardContent>
          </Card>
        </>
      )}

      <Separator />

      {/* Stock Reference - De-emphasized to compact grid */}
      <div className="rounded-lg bg-muted/30 p-4">
        <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
          Estado Actual
        </h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Stock</p>
            <p className="font-semibold text-foreground">
              {material.currentStock} {material.unit}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Sesiones</p>
            <p
              className={cn(
                'font-semibold',
                material.availableSessions >= material.minSessions
                  ? 'text-foreground'
                  : 'text-destructive'
              )}
            >
              {material.availableSessions}
            </p>
          </div>
        </div>

        {/* Low Stock Inline Warning */}
        {material.needsOrder && material.itemsPerBox && material.boxesToOrder > 0 && (
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-destructive font-medium">
              Se recomienda pedir {material.boxesToOrder} cajas
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export function MaterialDetailSheet({
  material,
  open,
  onClose,
}: MaterialDetailSheetProps) {
  const isDesktop = useIsDesktop()

  if (!material) return null

  // Desktop version: Dialog (centered modal)
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{material.name}</DialogTitle>
            <div className="flex gap-2 pt-2">
              <Badge variant="secondary">{material.code}</Badge>
            </div>
          </DialogHeader>

          <MaterialDetailContent material={material} />

          <div className="flex justify-center pt-4">
            <Button onClick={onClose} variant="outline">
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Mobile version: Sheet (bottom drawer)
  return (
    <Sheet open={open} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-xl">{material.name}</SheetTitle>
          <div className="flex gap-2 pt-2">
            <Badge variant="secondary">{material.code}</Badge>
            {material.itemsPerBox && (
              <Badge variant="outline">{material.itemsPerBox} items/caja</Badge>
            )}
          </div>
        </SheetHeader>

        <MaterialDetailContent material={material} />

        <SheetFooter className="pt-4">
          <Button onClick={onClose} variant="outline" className="w-full">
            Cerrar
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
