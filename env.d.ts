/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_DOMAIN: string;

  // API
  readonly VITE_API_DOMAIN: string;

  readonly VITE_ONLINE: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}