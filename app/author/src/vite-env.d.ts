/// <reference types="vite/client" />
/// <reference types="qyani-components/global" />
interface ImportMetaEnv {
  // 服务器地址
  readonly VITE_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
