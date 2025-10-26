import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

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
      <Outlet />
    </div>
  )
}
