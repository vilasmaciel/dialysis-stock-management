import { useState } from 'react'
import { Card, CardContent } from '#/shared/components/ui/card'
import { Button } from '#/shared/components/ui/button'
import { Badge } from '#/shared/components/ui/badge'
import { ChevronDown, ChevronUp, Download, Repeat, Package, CheckCircle, AlertTriangle } from 'lucide-react'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '#/shared/components/ui/collapsible'
import type { Order } from '#/shared/types'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface OrderHistoryCardProps {
  order: Order
  onDownload: () => void
  onRepeat: () => void
}

export function OrderHistoryCard({
  order,
  onDownload,
  onRepeat,
}: OrderHistoryCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const statusConfig = {
    sent: {
      icon: CheckCircle,
      label: 'Enviado',
      variant: 'default' as const,
      color: 'text-green-600',
    },
    failed: {
      icon: AlertTriangle,
      label: 'Falló',
      variant: 'destructive' as const,
      color: 'text-destructive',
    },
    draft: {
      icon: Package,
      label: 'Borrador',
      variant: 'secondary' as const,
      color: 'text-muted-foreground',
    },
  }

  const status = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.draft
  const StatusIcon = status.icon

  const formattedDate = format(new Date(order.createdAt), 'dd MMM yyyy', { locale: es })
  const formattedTime = order.emailSentAt
    ? format(new Date(order.emailSentAt), 'dd MMM yyyy • HH:mm', { locale: es })
    : null

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardContent className="p-4">
          {/* Collapsed view */}
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <h3 className="font-semibold truncate">Pedido #{order.orderNumber}</h3>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{formattedDate}</span>
                <span>•</span>
                <span>{order.items.length} items</span>
              </div>
              <Badge variant={status.variant} className="mt-2">
                <StatusIcon className="mr-1 h-3 w-3" />
                {status.label}
              </Badge>
            </div>

            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>

          {/* Expanded view */}
          <CollapsibleContent className="space-y-4 pt-4">
            {/* User info */}
            <div className="text-sm">
              <span className="text-muted-foreground">Por:</span>{' '}
              <span className="font-medium">{order.userName}</span>
            </div>

            {/* Items list */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Items:</h4>
              <ul className="space-y-1">
                {order.items.map((item, idx) => (
                  <li key={idx} className="text-sm flex justify-between">
                    <span>{item.description}</span>
                    <span className="text-muted-foreground">
                      {item.quantity} {item.unit}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Email status */}
            {order.emailSent && formattedTime && (
              <div className="text-sm text-muted-foreground">
                ✓ Enviado el {formattedTime}
              </div>
            )}

            {order.emailError && (
              <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                Error: {order.emailError}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2 border-t">
              <Button variant="outline" size="sm" onClick={onDownload}>
                <Download className="mr-2 h-4 w-4" />
                Descargar Excel
              </Button>
              <Button variant="outline" size="sm" onClick={onRepeat}>
                <Repeat className="mr-2 h-4 w-4" />
                Repetir Pedido
              </Button>
            </div>
          </CollapsibleContent>
        </CardContent>
      </Collapsible>
    </Card>
  )
}
