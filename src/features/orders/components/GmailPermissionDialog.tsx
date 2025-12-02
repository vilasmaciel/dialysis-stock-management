import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '#/shared/components/ui/dialog'
import { Button } from '#/shared/components/ui/button'
import { Mail, Check, X } from 'lucide-react'

interface GmailPermissionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConnectGmail: () => void
  onDownloadOnly: () => void
  isLoading?: boolean
}

export function GmailPermissionDialog({
  open,
  onOpenChange,
  onConnectGmail,
  onDownloadOnly,
  isLoading = false,
}: GmailPermissionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Conectar con Gmail
          </DialogTitle>
          <DialogDescription>
            Para enviar pedidos automáticamente necesitamos acceso a tu Gmail
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* What we will do */}
          <div>
            <h4 className="font-semibold mb-2">¿Qué haremos?</h4>
            <ul className="space-y-1">
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                Enviar emails desde tu cuenta
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary" />
                Adjuntar archivos Excel
              </li>
            </ul>
          </div>

          {/* What we won't do */}
          <div>
            <h4 className="font-semibold mb-2">¿Qué NO haremos?</h4>
            <ul className="space-y-1">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <X className="h-4 w-4" />
                Leer tus emails
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <X className="h-4 w-4" />
                Eliminar o modificar emails
              </li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <Button
            onClick={onConnectGmail}
            disabled={isLoading}
            className="w-full"
          >
            Conectar Gmail
          </Button>
          <Button
            onClick={onDownloadOnly}
            variant="outline"
            className="w-full"
          >
            Solo Descargar Excel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
