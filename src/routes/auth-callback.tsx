import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { supabase } from '#/shared/api/supabase'

export const Route = createFileRoute('/auth-callback')({
  component: AuthCallback,
})

function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Handle the OAuth callback
    const handleCallback = async () => {
      try {
        // Get the session from the URL hash
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Error getting session:', error)
          setError(error.message)
          // Wait a bit before redirecting to show error
          setTimeout(() => navigate({ to: '/login' }), 2000)
          return
        }

        if (data.session) {
          // Session successfully established and persisted
          console.log('Session established:', data.session.user.email)
          // Navigate to dashboard
          navigate({ to: '/dashboard' })
        } else {
          // No session found, redirect to login
          console.log('No session found, redirecting to login')
          setTimeout(() => navigate({ to: '/login' }), 1000)
        }
      } catch (err) {
        console.error('Unexpected error in auth callback:', err)
        setError('Error inesperado durante la autenticación')
        setTimeout(() => navigate({ to: '/login' }), 2000)
      }
    }

    handleCallback()
  }, [navigate])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 text-4xl">❌</div>
          <h2 className="mb-2 text-xl font-semibold text-red-600">Error de autenticación</h2>
          <p className="text-sm text-muted-foreground">{error}</p>
          <p className="mt-2 text-xs text-muted-foreground">Redirigiendo al login...</p>
        </div>
      </div>
    )
  }

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
