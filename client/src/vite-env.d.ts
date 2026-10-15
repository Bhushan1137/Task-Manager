/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly TASK_MANAGER_VITE_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
