import { useState, useEffect } from 'react'
import {
  initializeGapi,
  isSignedIn,
  signInWithGmail,
} from '../utils/gmailClient'
import { useSetting } from '#/shared/hooks/useSettings'

export function useGmailAuth() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [hasPermissions, setHasPermissions] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Load Google API credentials from settings
  const { data: googleApiCreds, isLoading: isLoadingCreds } = useSetting('google_api_credentials')

  // Initialize on mount when credentials are available
  useEffect(() => {
    if (isLoadingCreds) return

    if (!googleApiCreds?.client_id) {
      setError(new Error('Las credenciales de Google API no están configuradas. Por favor, ve a Configuración para añadirlas.'))
      setIsLoading(false)
      return
    }

    initializeGapi(googleApiCreds.client_id, googleApiCreds.api_key)
      .then(() => {
        setIsInitialized(true)
        setHasPermissions(isSignedIn())
      })
      .catch((err) => {
        setError(err)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [googleApiCreds, isLoadingCreds])

  // Sign in and request permissions
  const signIn = async () => {
    try {
      setIsLoading(true)
      setError(null)
      await signInWithGmail()
      setHasPermissions(isSignedIn())
    } catch (err) {
      setError(err as Error)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isInitialized,
    hasPermissions,
    isLoading,
    error,
    signIn,
  }
}
