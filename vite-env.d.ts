/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TELEGRAM_CLIENT_ID: string;
  // добавьте другие переменные по необходимости
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}