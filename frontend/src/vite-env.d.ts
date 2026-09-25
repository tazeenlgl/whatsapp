/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** The public URL this Nexcred frontend is served from. See .env.example. */
  readonly VITE_APP_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
