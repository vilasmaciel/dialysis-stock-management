import { useState, useEffect } from 'react'
import { ChevronRight, Package } from 'lucide-react'
import type { Material } from '#/shared/types/material'
import { cn } from '#/shared/lib/utils'

interface MaterialSettingsRowProps {
  material: Material
  onClick: () => void
}

export function MaterialSettingsRow({ material, onClick }: MaterialSettingsRowProps) {
  const [imageError, setImageError] = useState(false)

  // Reset image error when material changes
  useEffect(() => {
    setImageError(false)
  }, [material.photoUrl])
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg border bg-card p-3 text-left transition-colors',
        'hover:bg-muted/50 active:scale-[0.98]'
      )}
    >
      {/* Material image/placeholder */}
      {material.photoUrl && !imageError ? (
        <img
          src={material.photoUrl}
          alt={material.name}
          className="h-12 w-12 rounded object-cover flex-shrink-0"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded bg-muted flex-shrink-0">
          <Package className="h-6 w-6 text-muted-foreground" />
        </div>
      )}

      {/* Material info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <h3 className="font-semibold truncate">{material.name}</h3>
          <span className="text-xs text-muted-foreground flex-shrink-0">{material.code}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
          <span>
            <span className="font-medium">{material.usagePerSession}</span> {material.unit}/sesión
          </span>
        </div>
      </div>

      {/* Arrow indicator */}
      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
    </button>
  )
}

