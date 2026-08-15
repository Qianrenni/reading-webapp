import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const { QYANI_COMPONENTS_PATH, QYANI_CORE_PATH, VITE_BASE_URL } = env;
  console.log(`QYANI_COMPONENTS_PATH=${QYANI_COMPONENTS_PATH}`);
  console.log(`QYANI_CORE_PATH=${QYANI_CORE_PATH}`);
  console.log(`VITE_BASE_URL=${VITE_BASE_URL}`);
  return {
    base: '/author/',
    plugins: [vue()],
    server: {
      port: 8081,
      host: 'localhost',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        ...(QYANI_COMPONENTS_PATH && {
          'qyani-components': path.resolve(__dirname, QYANI_COMPONENTS_PATH),
        }),
        ...(QYANI_CORE_PATH && {
          '@qianrenni/core': path.resolve(__dirname, QYANI_CORE_PATH),
        }),
      },
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
});
