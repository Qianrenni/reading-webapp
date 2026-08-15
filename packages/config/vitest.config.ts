import { defineConfig } from 'vitest/config';

/**
 * @guga-reading/config 测试配置
 * Vite 预设为纯 Node 逻辑，无 DOM 依赖、无组件，仅 node 项目。
 */
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: [
        'coverage/**',
        'dist/**',
        'src/**/*.test.*',
        'src/**/index.*',
        'src/**/type.*',
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
          exclude: ['**/node_modules/**', '**/dist/**'],
        },
      },
    ],
  },
});
