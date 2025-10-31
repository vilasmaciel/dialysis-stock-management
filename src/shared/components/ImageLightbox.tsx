import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from '#/shared/components/ui/button'

interface ImageLightboxProps {
  open: boolean
  onClose: () => void
  imageUrl: string
  alt: string
}

export function ImageLightbox({ open, onClose, imageUrl, alt }: ImageLightboxProps) {
  // Close on ESC key press
  useEffect(() => {
    if (!open) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80"
      onClick={onClose}
    >
      <div className="relative flex items-center justify-center max-w-[95vw] max-h-[95vh] p-4">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Image */}
        <img
          src={imageUrl}
          alt={alt}
          className="max-w-full max-h-[95vh] w-auto h-auto object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  )
}
