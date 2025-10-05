/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_WS_URL: string;
  readonly VITE_ENV: string;
  // Agrega más variables de entorno aquí según las necesites
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}