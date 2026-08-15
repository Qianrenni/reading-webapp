import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  del: vi.fn(),
  patch: vi.fn(),
}));

vi.mock('../utils', () => ({
  get: mocks.get,
  post: mocks.post,
  put: mocks.put,
  del: mocks.del,
  patch: mocks.patch,
}));

import { useApiAuth } from './auth';

describe('useApiAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('authMe 携带 Authorization 头', async () => {
    mocks.get.mockResolvedValue({ success: true, data: null, message: null });
    await useApiAuth.authMe('Bearer', 'token123');

    expect(mocks.get).toHaveBeenCalledWith('/token/auth/me', {
      headers: { Authorization: 'Bearer token123' },
    });
  });

  it('login 携带用户名密码与验证码头', async () => {
    mocks.post.mockResolvedValue({ success: true, data: null, message: null });
    await useApiAuth.login('user', 'pass', 'cap', 'capId');

    expect(mocks.post).toHaveBeenCalledWith(
      '/token/get',
      { username: 'user', password: 'pass', captcha: 'cap' },
      { headers: { 'X-Captcha-Id': 'capId' } },
    );
  });

  it('refreshToken 携带刷新令牌头', async () => {
    mocks.post.mockResolvedValue({ success: true, data: null, message: null });
    await useApiAuth.refreshToken('Bearer', 'refreshToken');

    expect(mocks.post).toHaveBeenCalledWith(
      '/token/refresh',
      {},
      { headers: { Authorization: 'Bearer refreshToken' } },
    );
  });

  it('verifyEmail 发送邮箱', async () => {
    mocks.post.mockResolvedValue({ success: true, data: null, message: null });
    await useApiAuth.verifyEmail('a@qq.com');

    expect(mocks.post).toHaveBeenCalledWith('/token/verify_email', {
      email: 'a@qq.com',
    });
  });

  it('register 组装用户信息与验证码头', async () => {
    mocks.post.mockResolvedValue({ success: true, data: null, message: null });
    await useApiAuth.register(
      'user',
      'pass',
      'a@qq.com',
      'cap',
      'capId',
      'ava',
    );

    expect(mocks.post).toHaveBeenCalledWith(
      '/user/register',
      {
        user: {
          userName: 'user',
          password: 'pass',
          email: 'a@qq.com',
          avatar: 'ava',
        },
        captcha: 'cap',
      },
      { headers: { 'X-Captcha-Id': 'capId' } },
    );
  });

  it('register 未传 avatar 时默认空字符串', async () => {
    mocks.post.mockResolvedValue({ success: true, data: null, message: null });
    await useApiAuth.register('user', 'pass', 'a@qq.com', 'cap', 'capId');

    expect(mocks.post.mock.calls[0][1].user.avatar).toBe('');
  });
});
