import type { UserConfig } from 'vite';

export interface GugaViteConfigOptions {
  /** 部署基础路径，默认 '/' */
  base?: string;
  /** 开发服务器端口 */
  port?: number;
  /** 开发服务器监听地址 */
  host?: string;
  /** 应用 src 目录绝对路径（用于 '@' 别名与 .env 相对路径解析） */
  srcDir: string;
  /** loadEnv 加载的环境变量对象 */
  env?: Record<string, string | undefined>;
}

export function createGugaViteConfig(
  options: GugaViteConfigOptions,
): UserConfig;
