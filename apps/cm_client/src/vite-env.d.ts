/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_RASPBERRY_5_URL: string;
  readonly VITE_BASE_RASPBERRY_3_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}