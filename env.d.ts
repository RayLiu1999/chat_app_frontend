/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_DOMAIN: string;
  readonly VITE_API_DOMAIN: string;
  readonly VITE_ONLINE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}