/// <reference types="vite/client" />
/// <reference types="gapi" />
/// <reference types="gapi.auth2" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Declare gapi as a global variable
declare global {
  interface Window {
    gapi?: typeof gapi
  }
}
