import { describe, it, expect, vi, beforeEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  del: vi.fn(),
  patch: vi.fn(),
  email: vi.fn(),
}));

vi.mock('../utils', () => ({
  get: mocks.get,
  post: mocks.post,
  put: mocks.put,
  del: mocks.del,
  patch: mocks.patch,
  useValidate: { email: mocks.email },
}));

import { useApiUser } from './user';

describe('useApiUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.get.mockResolvedValue({ success: true, data: null, message: null });
    mocks.patch.mockResolvedValue({ success: true, data: null, message: null });
  });

  it('getUserCount', async () => {
    await useApiUser.getUserCount();
    expect(mocks.get).toHaveBeenCalledWith('/user/count');
  });

  it('getForgotPassword 邮箱不合法时不请求并返回错误', async () => {
    mocks.email.mockReturnValue(false);
    const result = await useApiUser.getForgotPassword('bad');
    expect(result).toEqual({
      success: false,
      data: null,
      message: '邮箱格式错误',
    });
    expect(mocks.get).not.toHaveBeenCalled();
  });

  it('getForgotPassword 合法邮箱发起请求', async () => {
    mocks.email.mockReturnValue(true);
    await useApiUser.getForgotPassword('a@qq.com');
    expect(mocks.get).toHaveBeenCalledWith(
      '/user/forgot-password?user_account=a@qq.com',
    );
  });

  it('patchForgotPassword 两次密码不一致时返回错误', async () => {
    mocks.email.mockReturnValue(true);
    const result = await useApiUser.patchForgotPassword(
      'a@qq.com',
      'code',
      'p1',
      'p2',
    );
    expect(result).toEqual({
      success: false,
      data: null,
      message: '密码不一致',
    });
    expect(mocks.patch).not.toHaveBeenCalled();
  });

  it('patchForgotPassword 校验通过后发起 patch', async () => {
    mocks.email.mockReturnValue(true);
    await useApiUser.patchForgotPassword('a@qq.com', 'code', 'p1', 'p1');
    expect(mocks.patch).toHaveBeenCalledWith('/user/forgot-password', {
      userAccount: 'a@qq.com',
      verifyCode: 'code',
      password: 'p1',
    });
  });

  it('updatePassword 校验通过后发起 patch', async () => {
    mocks.email.mockReturnValue(true);
    await useApiUser.updatePassword('a@qq.com', 'old', 'new', 'new');
    expect(mocks.patch).toHaveBeenCalledWith('/user/update-password', {
      userName: 'a@qq.com',
      oldPassword: 'old',
      newPassword: 'new',
    });
  });

  it('updatePassword 邮箱不合法时返回错误', async () => {
    mocks.email.mockReturnValue(false);
    const result = await useApiUser.updatePassword('bad', 'old', 'new', 'new');
    expect(result).toEqual({
      success: false,
      data: null,
      message: '邮箱格式错误',
    });
  });
});
