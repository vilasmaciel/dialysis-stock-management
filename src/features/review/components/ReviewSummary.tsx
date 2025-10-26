import { ReviewItem } from '../hooks/useReviewSession'
import { Button } from '#/shared/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/shared/components/ui/card'
import { cn } from '#/shared/lib/utils'

interface ReviewSummaryProps {
  reviewedItems: ReviewItem[]
  onSave: () => void
  onCancel: () => void
  isSaving: boolean
}

export function ReviewSummary({ reviewedItems, onSave, onCancel, isSaving }: ReviewSummaryProps) {
  const changedItems = reviewedItems.filter((item) => item.newStock !== item.previousStock)
  const unchangedItems = reviewedItems.filter((item) => item.newStock === item.previousStock)

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">📋 Resumen de Revisión</CardTitle>
          <CardDescription>
            Has revisado {reviewedItems.length} materiales. Revisa los cambios antes de guardar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-lg bg-muted p-4 text-center">
              <div className="text-3xl font-bold text-secondary">{reviewedItems.length}</div>
              <div className="text-sm text-secondary">Revisados</div>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <div className="text-3xl font-bold text-accent">{changedItems.length}</div>
              <div className="text-sm text-accent">Modificados</div>
            </div>
            <div className="rounded-lg bg-muted p-4 text-center">
              <div className="text-3xl font-bold text-primary">{unchangedItems.length}</div>
              <div className="text-sm text-primary">Sin cambios</div>
            </div>
          </div>

          {/* Materiales modificados */}
          {changedItems.length > 0 && (
            <div>
              <h3 className="mb-3 font-semibold">Materiales con cambios:</h3>
              <div className="space-y-2">
                {changedItems.map((item) => {
                  const change = item.newStock - item.previousStock
                  const isIncrease = change > 0

                  return (
                    <div
                      key={item.materialId}
                      className="flex items-center justify-between rounded-lg border bg-card p-3"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{item.materialName}</div>
                        <div className="text-sm text-muted-foreground">
                          {item.previousStock} → {item.newStock}
                        </div>
                      </div>
                      <div
                        className={cn(
                          'rounded-full px-3 py-1 text-sm font-semibold',
                          isIncrease
                            ? 'bg-muted text-primary'
                            : 'bg-muted text-destructive'
                        )}
                      >
                        {isIncrease ? '+' : ''}
                        {change.toFixed(1)}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Materiales sin cambios (colapsado) */}
          {unchangedItems.length > 0 && (
            <details className="rounded-lg border p-4">
              <summary className="cursor-pointer font-medium">
                Materiales sin cambios ({unchangedItems.length})
              </summary>
              <div className="mt-3 space-y-1">
                {unchangedItems.map((item) => (
                  <div key={item.materialId} className="text-sm text-muted-foreground">
                    • {item.materialName}: {item.newStock}
                  </div>
                ))}
              </div>
            </details>
          )}

          {/* Botones de acción */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onCancel} disabled={isSaving} className="flex-1" size="lg">
              Cancelar
            </Button>
            <Button onClick={onSave} disabled={isSaving} className="flex-1" size="lg">
              {isSaving ? 'Guardando...' : '💾 Guardar todo'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
