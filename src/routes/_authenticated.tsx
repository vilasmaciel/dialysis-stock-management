import { createFileRoute, Outlet, redirect, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '#/shared/contexts/AuthContext'

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
  const { session, isLoading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to login if session is lost (e.g., after signOut)
    if (!isLoading && !session) {
      console.log('🔒 Session lost, redirecting to login...')
      navigate({ to: '/login' })
    }
  }, [session, isLoading, navigate])

  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  )
}
