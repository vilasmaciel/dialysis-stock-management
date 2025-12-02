import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '#/shared/components/ui/dialog'
import { Button } from '#/shared/components/ui/button'
import { Label } from '#/shared/components/ui/label'
import { Textarea } from '#/shared/components/ui/textarea'
import { Paperclip, Loader2 } from 'lucide-react'

interface OrderPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSend: (message: string) => void
  recipientEmail: string
  ccEmails: string[]
  subject: string
  defaultMessage: string
  attachmentFilename: string
  isSending?: boolean
}

export function OrderPreviewDialog({
  open,
  onOpenChange,
  onSend,
  recipientEmail,
  ccEmails,
  subject,
  defaultMessage,
  attachmentFilename,
  isSending = false,
}: OrderPreviewDialogProps) {
  const [message, setMessage] = useState(defaultMessage)

  // Reset message when dialog opens
  useEffect(() => {
    if (open) {
      setMessage(defaultMessage)
    }
  }, [open, defaultMessage])

  const handleSend = () => {
    onSend(message)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Confirmar Envío del Pedido</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Recipient */}
          <div className="space-y-1">
            <Label className="text-sm font-medium">Para:</Label>
            <p className="text-sm text-muted-foreground">{recipientEmail}</p>
          </div>

          {/* CC */}
          {ccEmails.length > 0 && (
            <div className="space-y-1">
              <Label className="text-sm font-medium">CC:</Label>
              <p className="text-sm text-muted-foreground">{ccEmails.join(', ')}</p>
            </div>
          )}

          {/* Subject */}
          <div className="space-y-1">
            <Label className="text-sm font-medium">Asunto:</Label>
            <p className="text-sm text-muted-foreground">{subject}</p>
          </div>

          {/* Message (editable) */}
          <div className="space-y-2">
            <Label htmlFor="message">Mensaje (editable)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
          </div>

          {/* Attachment */}
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Paperclip className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{attachmentFilename}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
          >
            Cancelar
          </Button>
          <Button onClick={handleSend} disabled={isSending}>
            {isSending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar Email'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
