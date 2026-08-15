import { defineConfig } from 'vitest/config';

/**
 * @qyani/eslint-config 测试配置
 * 冒烟测试验证 ESLint 扁平配置可正常加载。
 */
export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.test.mjs'],
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['coverage/**', 'dist/**', 'node_modules/**', 'test/**'],
    },
  },
});
