/// <reference types="vite/client" />

interface ViteTypeOptions {
  // この行を追加することで ImportMetaEnv の型を厳密にし、不明なキーを許可しないようにできます。
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_PARTY_SERVER_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
