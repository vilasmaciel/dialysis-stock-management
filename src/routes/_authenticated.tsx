import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { Header } from '#/shared/components/Header'
import { BottomNavigation } from '#/shared/components/BottomNavigation'
import { Toaster } from '#/shared/components/ui/sonner'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    // @ts-expect-error - context types will be added later
    if (!context.auth?.session) {
      throw redirect({ to: '/login' })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pb-20 sm:pb-0">
        <Outlet />
      </main>
      <BottomNavigation />
      <Toaster />
    </div>
  )
}
