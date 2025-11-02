import { ArrowLeft } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '#/shared/components/ui/button'
import { cn } from '#/shared/lib/utils'

interface PageHeaderProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  showBack?: boolean
  backTo?: string
  onBack?: () => void
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  subtitle,
  icon,
  showBack = false,
  backTo,
  onBack,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-3 sm:mb-6', className)}>
      {showBack && (
        <div className="mb-2">
          {backTo ? (
            <Link to={backTo}>
              <Button variant="ghost" size="sm" className="-ml-2">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
              </Button>
            </Link>
          ) : (
            <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex-1">
          <h1 className="flex items-center gap-2 text-xl sm:text-2xl font-bold">
            {icon}
            {title}
          </h1>
          {subtitle && <p className="text-xs sm:text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>

        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  )
}
