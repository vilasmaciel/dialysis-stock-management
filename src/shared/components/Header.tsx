import { Link } from '@tanstack/react-router'
import { History, Settings, LogOut, ChevronDown, Info } from 'lucide-react'
import { useAuth } from '#/shared/contexts/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/shared/components/ui/dropdown-menu'
import { Button } from '#/shared/components/ui/button'

export function Header() {
  const { user, signOut } = useAuth()

  const displayName = user?.user_metadata?.full_name || user?.email || 'Usuario'

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <img
            src="/icon-192x192.png"
            alt="Dialysis Stock Management"
            className="h-10 w-10"
          />
          <span className="hidden sm:inline text-lg font-semibold">DialyStock</span>
        </Link>

        {/* Right side: Info button + User Menu */}
        <div className="flex items-center gap-2">
          {/* Info Button */}
          <Link to="/info">
            <Button variant="ghost" size="icon" title="Información y contactos">
              <Info className="h-5 w-5" />
            </Button>
          </Link>

          {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <span className="hidden sm:inline">{displayName}</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium text-sm">{displayName}</p>
                {user?.email && (
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                )}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/historial" className="cursor-pointer">
                <History className="mr-2 h-4 w-4" />
                <span>Historial</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configuración</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:text-destructive"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

