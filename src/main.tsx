import React, { useMemo } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { routeTree } from './routeTree.gen'
import { AuthProvider, useAuth } from './shared/contexts/AuthContext'
import './index.css'

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
})

// Create a new router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient,
    auth: undefined!, // This will be set by the RouterProvider
  },
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

function App() {
  const auth = useAuth()

  // Memoize the router context to prevent unnecessary re-renders
  const routerContext = useMemo(
    () => ({ queryClient, auth }),
    [auth.session, auth.isLoading]
  )

  // Show loading screen while checking authentication
  if (auth.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="mb-4 mx-auto h-12 w-12 animate-spin text-primary" />
          <h2 className="mb-2 text-xl font-semibold">Cargando...</h2>
          <p className="text-sm text-muted-foreground">
            Verificando tu sesión
          </p>
        </div>
      </div>
    )
  }

  return <RouterProvider router={router} context={routerContext} />
}

const rootElement = document.getElementById('root')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  )
}
