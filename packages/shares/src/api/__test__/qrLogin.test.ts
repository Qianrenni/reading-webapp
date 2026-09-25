import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
}));

vi.mock('../../utils', () => ({
  get: mocks.get,
  post: mocks.post,
}));

import { useApiQrLogin } from '../qrLogin';

describe('useApiQrLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('create 请求票据接口', async () => {
    mocks.post.mockResolvedValue({ success: true, data: null, message: '' });
    await useApiQrLogin.create();

    expect(mocks.post).toHaveBeenCalledWith('/token/qr/create');
  });

  it('status 以查询参数携带票据', async () => {
    mocks.get.mockResolvedValue({ success: true, data: null, message: '' });
    await useApiQrLogin.status('ticket-1');

    expect(mocks.get).toHaveBeenCalledWith('/token/qr/status', {
      params: { ticket: 'ticket-1' },
    });
  });

  it('exchange 以请求体携带票据', async () => {
    mocks.post.mockResolvedValue({ success: true, data: null, message: '' });
    await useApiQrLogin.exchange('ticket-1');

    expect(mocks.post).toHaveBeenCalledWith('/token/qr/exchange', {
      ticket: 'ticket-1',
    });
  });
});
