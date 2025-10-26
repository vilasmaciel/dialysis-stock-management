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
    let timeoutId: NodeJS.Timeout

    // Listen for auth state changes - this will fire when Supabase processes the URL hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth callback - event:', event, 'session:', session?.user?.email)

      if (event === 'SIGNED_IN' && session) {
        // Successfully signed in, session is now persisted
        console.log('✅ User signed in successfully:', session.user.email)
        console.log('✅ Session will be persisted in localStorage')

        // Small delay to ensure session is fully saved
        timeoutId = setTimeout(() => {
          navigate({ to: '/dashboard' })
        }, 500)
      } else if (event === 'INITIAL_SESSION' && !session) {
        // No session in the URL, redirect to login
        console.log('❌ No session found in callback')
        timeoutId = setTimeout(() => {
          navigate({ to: '/login' })
        }, 1000)
      } else if (event === 'USER_UPDATED') {
        // User data updated, but we might already be signed in
        if (session) {
          console.log('✅ User session updated:', session.user.email)
          timeoutId = setTimeout(() => {
            navigate({ to: '/dashboard' })
          }, 500)
        }
      }
    })

    // Fallback: if nothing happens in 10 seconds, redirect to login
    const fallbackTimeout = setTimeout(() => {
      console.log('⏱️ Timeout waiting for auth callback, checking session...')
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          console.log('✅ Session found on timeout, redirecting to dashboard')
          navigate({ to: '/dashboard' })
        } else {
          console.log('❌ No session found on timeout, redirecting to login')
          setError('La autenticación está tardando demasiado')
          setTimeout(() => navigate({ to: '/login' }), 2000)
        }
      })
    }, 10000)

    return () => {
      subscription.unsubscribe()
      clearTimeout(timeoutId)
      clearTimeout(fallbackTimeout)
    }
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
        <p className="mt-2 text-xs text-gray-400">
          Esto puede tomar unos segundos...
        </p>
      </div>
    </div>
  )
}
