/// <reference types="vite/client" />
/// <reference types="qyani-components/global" />
interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
