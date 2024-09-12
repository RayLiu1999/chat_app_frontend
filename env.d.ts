/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_URL: string;

  // API
  readonly VITE_API_URL: string;
  readonly VITE_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}