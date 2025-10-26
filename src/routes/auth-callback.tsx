import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useAuth } from '#/shared/contexts/AuthContext'

export const Route = createFileRoute('/auth-callback')({
  component: AuthCallback,
})

function AuthCallback() {
  const navigate = useNavigate()
  const { session, isLoading } = useAuth()

  useEffect(() => {
    // Wait for auth state to settle
    if (!isLoading) {
      if (session) {
        // Successfully authenticated, redirect to dashboard
        navigate({ to: '/dashboard' })
      } else {
        // No session, redirect back to login
        navigate({ to: '/login' })
      }
    }
  }, [session, isLoading, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-4xl">🔄</div>
        <h2 className="mb-2 text-xl font-semibold">Iniciando sesión...</h2>
        <p className="text-sm text-muted-foreground">
          Por favor espera mientras completamos tu autenticación
        </p>
      </div>
    </div>
  )
}
