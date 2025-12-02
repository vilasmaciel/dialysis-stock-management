import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '#/shared/components/ui/alert-dialog'
import { Button } from '#/shared/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface OrderErrorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onRetry: () => void
  onDownload: () => void
  error: string
  isRetrying?: boolean
}

export function OrderErrorDialog({
  open,
  onOpenChange,
  onRetry,
  onDownload,
  error,
  isRetrying = false,
}: OrderErrorDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Error al enviar el email
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>No se pudo enviar el email:</p>
            <p className="font-mono text-sm bg-muted p-2 rounded">{error}</p>
            <div>
              <p className="font-semibold mb-1">Posibles causas:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Sin conexión a internet</li>
                <li>Permisos de Gmail revocados</li>
                <li>Límite de 5 envíos diarios alcanzado</li>
              </ul>
            </div>
            <p className="text-sm">
              El pedido se ha guardado en el sistema con estado "Falló"
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onRetry}
            disabled={isRetrying}
            className="w-full sm:w-auto"
          >
            Reintentar Envío
          </Button>
          <Button onClick={onDownload} className="w-full sm:w-auto">
            Descargar Excel
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
