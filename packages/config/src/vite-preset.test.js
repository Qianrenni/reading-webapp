import { describe, it, expect } from 'vitest';
import path from 'node:path';
import { createGugaViteConfig } from './vite-preset.js';

describe('createGugaViteConfig', () => {
  it('返回默认配置（base/port/host/别名）', () => {
    const srcDir = path.resolve('/abs/src');
    const config = createGugaViteConfig({ srcDir });

    expect(config.base).toBe('/');
    expect(config.server.port).toBe(8080);
    expect(config.server.host).toBe('0.0.0.0');
    expect(config.resolve.alias['@']).toBe(srcDir);
    // vue 插件已在 plugins 中注册
    expect(Array.isArray(config.plugins)).toBe(true);
    // 未配置 qyani 路径时不应生成别名
    expect(config.resolve.alias['qyani-components']).toBeUndefined();
    expect(config.resolve.alias['@qianrenni/core']).toBeUndefined();
  });

  it('可覆盖 base/port/host', () => {
    const config = createGugaViteConfig({
      base: '/admin/',
      port: 3000,
      host: '127.0.0.1',
      srcDir: path.resolve('/proj/src'),
    });

    expect(config.base).toBe('/admin/');
    expect(config.server.port).toBe(3000);
    expect(config.server.host).toBe('127.0.0.1');
  });

  it('env 提供 qyani 路径时生成相对 srcDir 解析的别名', () => {
    const srcDir = path.resolve('/proj/src');
    const config = createGugaViteConfig({
      srcDir,
      env: {
        QYANI_COMPONENTS_PATH: '../lib/qyani-components',
        QYANI_CORE_PATH: '../lib/qyani-core',
      },
    });

    expect(config.resolve.alias['qyani-components']).toBe(
      path.resolve(srcDir, '..', '../lib/qyani-components'),
    );
    expect(config.resolve.alias['@qianrenni/core']).toBe(
      path.resolve(srcDir, '..', '../lib/qyani-core'),
    );
  });

  it('manualChunks 按第三方库分组拆包', () => {
    const config = createGugaViteConfig({ srcDir: path.resolve('/proj/src') });
    const manualChunks = config.build.rollupOptions.output.manualChunks;

    expect(manualChunks('/node_modules/qyani-components/dist/index.js')).toBe(
      'qyani',
    );
    expect(manualChunks('/node_modules/vue/dist/vue.js')).toBe('vue-vendor');
    expect(manualChunks('/node_modules/vue-router/dist/index.js')).toBe(
      'vue-vendor',
    );
    expect(manualChunks('/node_modules/pinia/dist/index.js')).toBe(
      'vue-vendor',
    );
    expect(manualChunks('/node_modules/echarts/index.js')).toBe('echarts');
    expect(manualChunks('/node_modules/@vueuse/core/index.js')).toBe('vueuse');
    expect(manualChunks('/node_modules/axios/index.js')).toBe('vendor');
    // 业务代码不进入任何 vendor chunk
    expect(manualChunks('/proj/src/main.ts')).toBeUndefined();
  });
});
