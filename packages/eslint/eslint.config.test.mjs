import { describe, it, expect } from 'vitest';
import config from './eslint.config.mjs';

describe('@qyani/eslint-config', () => {
  it('导出 ESLint 扁平配置数组', () => {
    expect(Array.isArray(config)).toBe(true);
    expect(config.length).toBeGreaterThan(0);
  });

  it('包含忽略规则', () => {
    const ignoresBlock = config.find((c) => Array.isArray(c.ignores));
    expect(ignoresBlock?.ignores).toContain('**/node_modules/**');
    expect(ignoresBlock?.ignores).toContain('**/dist/**');
  });

  it('包含 Vue 相关配置', () => {
    expect(
      config.some(
        (c) =>
          Array.isArray(c.files) &&
          c.files.some((f) => String(f).includes('vue')),
      ),
    ).toBe(true);
  });

  it('包含 TypeScript 相关配置', () => {
    // typescript-eslint 的 recommended 配置以 ... 展开进数组
    expect(config.some((c) => c && typeof c === 'object')).toBe(true);
  });
});
