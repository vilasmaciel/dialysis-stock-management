import { useState } from 'react'
import { Copy, Check, Mail } from 'lucide-react'
import { toast } from 'sonner'
import { copyToClipboard } from '#/shared/utils/clipboard'
import { cn } from '#/shared/lib/utils'
import { Button } from '#/shared/components/ui/button'

interface CopyableEmailProps {
  email: string
  showIcon?: boolean
  className?: string
  variant?: 'default' | 'button'
}

export function CopyableEmail({
  email,
  showIcon = true,
  className,
  variant = 'default'
}: CopyableEmailProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const success = await copyToClipboard(email)

    if (success) {
      setCopied(true)
      toast.success('Email copiado al portapapeles', {
        description: email,
        duration: 2000,
      })

      // Reset icon after 2 seconds
      setTimeout(() => setCopied(false), 2000)
    } else {
      toast.error('Error al copiar el email', {
        description: 'Por favor, copia manualmente: ' + email,
      })
    }
  }

  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleCopy}
        className={cn('justify-start gap-2', className)}
      >
        {showIcon && <Mail className="h-4 w-4" />}
        <span>{email}</span>
        {copied ? (
          <Check className="ml-auto h-4 w-4 text-primary" />
        ) : (
          <Copy className="ml-auto h-4 w-4" />
        )}
      </Button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer group',
        className
      )}
    >
      {showIcon && <Mail className="h-4 w-4 flex-shrink-0" />}
      <span className="group-hover:underline">{email}</span>
      {copied ? (
        <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
      ) : (
        <Copy className="h-3.5 w-3.5 flex-shrink-0" />
      )}
    </button>
  )
}
