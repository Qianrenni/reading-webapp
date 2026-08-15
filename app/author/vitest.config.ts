import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import { playwright } from '@vitest/browser-playwright';

/**
 * @guga-reading/author 测试配置
 *
 * - node：纯逻辑/composable/store 测试（默认），DOM 依赖用 `// @vitest-environment jsdom` 注解
 * - browser：组件渲染测试（`src/components/** /*.render.test.ts`），真实浏览器（Playwright + vitest-browser-vue）
 */
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'coverage/**',
        'dist/**',
        'src/**/*.test.ts',
        'src/**/index.ts',
        'src/**/type.ts',
        'src/types/**',
        'src/**/*.d.ts',
        '**/*.d.ts',
        'vite.config.ts',
        'test/**',
      ],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'node',
          environment: 'node',
          setupFiles: ['./test/setup.ts'],
          exclude: [
            '**/node_modules/**',
            '**/dist/**',
            'src/components/**/*.render.test.ts',
          ],
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          include: ['src/components/**/*.render.test.ts'],
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
