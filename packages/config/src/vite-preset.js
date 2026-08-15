import path from 'node:path';
import vue from '@vitejs/plugin-vue';

/**
 * 构建 GUGA 各前端应用的统一 Vite 配置。
 * 差异项（base / port / host / srcDir / env）由各应用传入，
 * 其余（qyani 本地源码 alias、vendor 拆包、插件）在这里统一维护一份。
 *
 * @param {{base?:string, port?:number, host?:string, srcDir:string, env?:Record<string,string|undefined>}} options
 */
export function createGugaViteConfig({
  base = '/',
  port = 8080,
  host = '0.0.0.0',
  srcDir,
  env = {},
}) {
  const { QYANI_COMPONENTS_PATH, QYANI_CORE_PATH, VITE_BASE_URL } = env;
  console.log(`QYANI_COMPONENTS_PATH=${QYANI_COMPONENTS_PATH}`);
  console.log(`QYANI_CORE_PATH=${QYANI_CORE_PATH}`);
  console.log(`VITE_BASE_URL=${VITE_BASE_URL}`);

  const alias = {
    '@': srcDir,
  };
  if (QYANI_COMPONENTS_PATH) {
    // .env 中的路径相对应用根目录解析（绝对路径时原样返回）
    alias['qyani-components'] = path.resolve(
      srcDir,
      '..',
      QYANI_COMPONENTS_PATH,
    );
  }
  if (QYANI_CORE_PATH) {
    alias['@qianrenni/core'] = path.resolve(srcDir, '..', QYANI_CORE_PATH);
  }

  return {
    base,
    plugins: [vue()],
    server: {
      port,
      host,
    },
    resolve: {
      alias,
    },
    build: {
      // 常规 vendor chunk（vue/echarts 等）阈值可放宽，qyani 全局组件库仍会提示
      chunkSizeWarningLimit: 800,
      rollupOptions: {
        output: {
          // 按第三方库分组拆包：减小主 bundle 体积、利于长缓存
          manualChunks(id) {
            // qyani 组件库与核心（本地 alias 源码或 node_modules 兜底）
            if (id.includes('qyani-components')) {
              return 'qyani';
            }
            if (id.includes('node_modules')) {
              // Vue 生态（vue / vue-router / pinia / @vue/*）
              if (
                /[\\/]node_modules[\\/](vue|@vue|vue-router|pinia)[\\/]/.test(
                  id,
                )
              ) {
                return 'vue-vendor';
              }
              // ECharts 及依赖 zrender（数据统计）
              if (/[\\/]node_modules[\\/](echarts|zrender)[\\/]/.test(id)) {
                return 'echarts';
              }
              // VueUse 及 vue-demi
              if (id.includes('@vueuse') || id.includes('vue-demi')) {
                return 'vueuse';
              }
              // 其余第三方依赖
              return 'vendor';
            }
            // 业务代码留在各入口 chunk
            return undefined;
          },
        },
      },
    },
  };
}
