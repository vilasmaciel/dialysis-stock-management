import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { ClipboardList, Loader2, PackageX, ArrowLeft, X } from 'lucide-react'
import { useMaterials, useUpdateMaterialStock } from '#/features/inventory/hooks/useMaterials'
import { useReviewSession } from '#/features/review/hooks/useReviewSession'
import { ReviewCard } from '#/features/review/components/ReviewCard'
import { ReviewSummary } from '#/features/review/components/ReviewSummary'
import { Button } from '#/shared/components/ui/button'
import { useAuth } from '#/shared/contexts/AuthContext'

export const Route = createFileRoute('/_authenticated/review')({
  component: ReviewPage,
})

function ReviewPage() {
  const { data: materials, isLoading } = useMaterials()
  const { mutate: updateStock } = useUpdateMaterialStock()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isSaving, setIsSaving] = useState(false)

  const {
    currentMaterial,
    currentIndex,
    totalItems,
    progress,
    isLastItem,
    isComplete,
    reviewedItems,
    markAsReviewed,
    goToPrevious,
  } = useReviewSession(materials || [])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mb-2 mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Cargando materiales...</p>
        </div>
      </div>
    )
  }

  if (!materials || materials.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <PackageX className="mb-2 mx-auto h-16 w-16 text-muted-foreground" />
          <h3 className="mb-1 font-semibold">No hay materiales para revisar</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Agrega materiales a tu inventario primero
          </p>
          <Link to="/dashboard">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleSaveAll = async () => {
    if (!user) return

    setIsSaving(true)

    // Filter only items that changed
    const changedItems = reviewedItems.filter(
      (item) => item.newStock !== item.previousStock
    )

    // Update all materials in sequence
    for (const item of changedItems) {
      await new Promise<void>((resolve) => {
        updateStock(
          {
            materialId: item.materialId,
            newStock: item.newStock,
            userId: user.id,
            userName: user.user_metadata?.full_name || user.email || 'Usuario',
            changeType: 'review',
            notes: `Revisión de inventario: ${item.previousStock} → ${item.newStock}`,
          },
          {
            onSettled: () => resolve(),
          }
        )
      })
    }

    setIsSaving(false)
    navigate({ to: '/inventory' })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold">
              <ClipboardList className="h-6 w-6" />
              Revisión de Inventario
            </h1>
            {!isComplete && (
              <p className="text-sm text-muted-foreground">
                Material {currentIndex + 1} de {totalItems}
              </p>
            )}
          </div>
          <Link to="/dashboard">
            <Button variant="ghost">
              <X className="mr-2 h-4 w-4" />
              Cancelar
            </Button>
          </Link>
        </div>
      </header>

      {/* Progress Bar */}
      {!isComplete && (
        <div className="bg-card">
          <div className="container mx-auto px-4 pb-4">
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto p-6">
        {!isComplete ? (
          <ReviewCard
            material={currentMaterial}
            onConfirm={markAsReviewed}
            onBack={goToPrevious}
            isFirst={currentIndex === 0}
            isLast={isLastItem}
          />
        ) : (
          <ReviewSummary
            reviewedItems={reviewedItems}
            onSave={handleSaveAll}
            onCancel={() => navigate({ to: '/dashboard' })}
            isSaving={isSaving}
          />
        )}
      </div>
    </div>
  )
}
