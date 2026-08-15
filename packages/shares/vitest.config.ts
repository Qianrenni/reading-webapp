import { defineConfig } from 'vitest/config';

/**
 * @guga-reading/shares 测试配置
 *
 * 通过 projects 分离测试环境：
 * - node：纯逻辑测试（默认），依赖 DOM 的文件用 `// @vitest-environment jsdom` 注解切换
 *   （如 txtParser/useDom/useHtmlUtil/convert 需要 FileReader/document 等）
 * shares 无 Vue 组件，故不启用 browser 项目。
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
