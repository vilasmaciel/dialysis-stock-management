import { useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { Home, ClipboardCheck, ShoppingCart, Menu, Settings, History, Info, LogOut } from 'lucide-react'
import { Button } from '#/shared/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '#/shared/components/ui/sheet'
import { Separator } from '#/shared/components/ui/separator'
import { useAuth } from '#/shared/contexts/AuthContext'
import { cn } from '#/shared/lib/utils'

type NavItem =
  | { to: string; icon: typeof Home; label: string; isMenu?: false }
  | { icon: typeof Menu; label: string; isMenu: true }

const NAV_ITEMS: readonly NavItem[] = [
  { to: '/dashboard', icon: Home, label: 'Inicio' },
  { to: '/review', icon: ClipboardCheck, label: 'Revisar' },
  { to: '/orders', icon: ShoppingCart, label: 'Pedidos' },
  { icon: Menu, label: 'Más', isMenu: true },
]

export function BottomNavigation() {
  const location = useLocation()
  const { signOut } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Ocultar en páginas de flujo enfocado y páginas secundarias
  const hiddenPaths = ['/review', '/orders', '/settings', '/historial', '/info']
  if (hiddenPaths.includes(location.pathname)) {
    return null
  }

  return (
    <>
      <nav className="sm:hidden fixed bottom-0 inset-x-0 z-50 border-t bg-card">
        <div className="grid grid-cols-4 gap-1 p-2">
          {NAV_ITEMS.map((item) =>
            item.isMenu ? (
              <button
                key="menu"
                onClick={() => setIsMenuOpen(true)}
                className="flex flex-col items-center justify-center gap-1 rounded-lg p-2 text-sm transition-colors hover:bg-muted"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </button>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'flex flex-col items-center justify-center gap-1 rounded-lg p-2 text-sm transition-colors hover:bg-muted',
                  location.pathname === item.to && 'text-primary bg-primary/10'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            )
          )}
        </div>
      </nav>

      {/* Sheet para menú "Más" */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>Menú</SheetTitle>
          </SheetHeader>
          <div className="space-y-2 py-4">
            <Link to="/settings" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2 h-4 w-4" />
                Configuración
              </Button>
            </Link>
            <Link to="/historial" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <History className="mr-2 h-4 w-4" />
                Historial
              </Button>
            </Link>
            <Link to="/info" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                <Info className="mr-2 h-4 w-4" />
                Información
              </Button>
            </Link>
            <Separator className="my-2" />
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={() => {
                setIsMenuOpen(false)
                signOut()
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
