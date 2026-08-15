import { defineConfig } from 'vitest/config';

/**
 * @guga-reading/types 测试配置
 * 仅含类型声明，测试以类型断言（expectTypeOf）为主，node 项目即可。
 */
export default defineConfig({
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
          exclude: ['**/node_modules/**', '**/dist/**'],
        },
      },
    ],
  },
});
