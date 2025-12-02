import { useState, useEffect } from 'react'
import {
  initializeGapi,
  isSignedIn,
  signInWithGmail,
} from '../utils/gmailClient'

export function useGmailAuth() {
  const [isInitialized, setIsInitialized] = useState(false)
  const [hasPermissions, setHasPermissions] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // Initialize on mount
  useEffect(() => {
    initializeGapi()
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
  }, [])

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
