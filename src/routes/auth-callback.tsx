import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import { supabase } from '#/shared/api/supabase'

export const Route = createFileRoute('/auth-callback')({
  component: AuthCallback,
})

function AuthCallback() {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let hasRedirected = false

    // First, try to get the session from URL hash immediately
    const processAuthCallback = async () => {
      try {
        console.log('🔄 Processing auth callback from URL hash...')
        
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ Error getting session:', error)
          setError('Error de autenticación')
          setTimeout(() => navigate({ to: '/login' }), 2000)
          return
        }

        if (session) {
          console.log('✅ Session found immediately:', session.user.email)
          hasRedirected = true
          navigate({ to: '/dashboard' })
        } else {
          console.log('⚠️ No session in URL hash, waiting for onAuthStateChange...')
        }
      } catch (error) {
        console.error('❌ Error in processAuthCallback:', error)
      }
    }

    // Process immediately
    processAuthCallback()

    // Listen for auth state changes as fallback
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (hasRedirected) return
      
      console.log('Auth callback - event:', event, 'session:', session?.user?.email)

      if (event === 'SIGNED_IN' && session) {
        console.log('✅ User signed in successfully:', session.user.email)
        hasRedirected = true
        navigate({ to: '/dashboard' })
      } else if (event === 'INITIAL_SESSION' && !session) {
        console.log('❌ No session found in callback')
        timeoutId = setTimeout(() => {
          navigate({ to: '/login' })
        }, 500)
      }
    })

    // Fallback: if nothing happens in 5 seconds, redirect to login
    const fallbackTimeout = setTimeout(() => {
      if (hasRedirected) return
      
      console.log('⏱️ Timeout waiting for auth callback, redirecting to login')
      setError('La autenticación está tardando demasiado')
      setTimeout(() => navigate({ to: '/login' }), 2000)
    }, 5000)

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
          <AlertCircle className="mb-4 mx-auto h-16 w-16 text-red-600" />
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
        <Loader2 className="mb-4 mx-auto h-12 w-12 animate-spin text-primary" />
        <h2 className="mb-2 text-xl font-semibold">Autenticando...</h2>
        <p className="text-sm text-muted-foreground">
          Por favor espera
        </p>
      </div>
    </div>
  )
}
