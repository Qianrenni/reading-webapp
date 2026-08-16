import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  del: vi.fn(),
  patch: vi.fn(),
}));

vi.mock('../../utils', () => ({
  get: mocks.get,
  post: mocks.post,
  put: mocks.put,
  del: mocks.del,
  patch: mocks.patch,
}));

import { useApiSystem } from '../system';

describe('useApiSystem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.get.mockResolvedValue({ success: true, data: null, message: null });
    mocks.put.mockResolvedValue({ success: true, data: null, message: null });
  });

  it('getSystemInfo', async () => {
    await useApiSystem.getSystemInfo();
    expect(mocks.get).toHaveBeenCalledWith('/system/info');
  });

  it('getConfigs', async () => {
    await useApiSystem.getConfigs();
    expect(mocks.get).toHaveBeenCalledWith('/system/config');
  });

  it('updateConfig', async () => {
    await useApiSystem.updateConfig('RATE_LIMIT', { max: '10' });
    expect(mocks.put).toHaveBeenCalledWith('/system/config/RATE_LIMIT', {
      max: '10',
    });
  });

  it('getLogFiles', async () => {
    await useApiSystem.getLogFiles();
    expect(mocks.get).toHaveBeenCalledWith('/system/logs');
  });

  it('readLog 默认分页', async () => {
    await useApiSystem.readLog('app.log');
    expect(mocks.get).toHaveBeenCalledWith(
      '/system/logs/read?file=app.log&page=1&size=100',
    );
  });

  it('readLog 带 level 与 regex', async () => {
    await useApiSystem.readLog('app.log', 'ERROR', 2, 50, '\\d+');
    expect(mocks.get).toHaveBeenCalledWith(
      '/system/logs/read?file=app.log&page=2&size=50&level=ERROR&regex=%5Cd%2B',
    );
  });
});
