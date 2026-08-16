// @vitest-environment jsdom
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
  type Mock,
} from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import axios from 'axios';

const { getItem, setItem, removeItem } = vi.hoisted(() => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}));

vi.mock('qyani-components', () => ({
  // 必须用普通 function 作为构造函数实现（箭头函数不能被 new）
  UseLocalStorage: vi.fn().mockImplementation(function () {
    return { getItem, setItem, removeItem };
  }),
}));

vi.mock('../../api', () => ({
  useApiAuth: {
    authMe: vi.fn(),
    refreshToken: vi.fn(),
  },
}));

import { useApiAuth as realUseApiAuth } from '../../api';
import { useAuthStore } from '../useAuthStore';

const apiAuth = realUseApiAuth as unknown as {
  authMe: Mock;
  refreshToken: Mock;
};

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    delete axios.defaults.headers.common['Authorization'];
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('初始状态：未登录、无令牌', () => {
    const store = useAuthStore();
    expect(store.isLogin).toBe(false);
    expect(store.getAccessToken).toBeNull();
    expect(store.getRefreshToken).toBeNull();
    expect(store.getTokenType).toBeNull();
    expect(store.getUser).toBeNull();
    expect(store.redirectUrl).toBeNull();
    expect(store.isRemember).toBe(true);
  });

  it('setToken 记住登录时写入 localStorage', () => {
    const store = useAuthStore();
    store.setToken('acc', 'ref', 'Bearer');

    expect(store.getAccessToken).toBe('acc');
    expect(store.getRefreshToken).toBe('ref');
    expect(store.getTokenType).toBe('Bearer');
    expect(setItem).toHaveBeenCalledWith('token', {
      accessToken: 'acc',
      refreshToken: 'ref',
      tokenType: 'Bearer',
    });
  });

  it('setToken 不记住登录时清除 localStorage', () => {
    const store = useAuthStore();
    store.setRemember(false);
    store.setToken('acc', 'ref', 'Bearer');

    expect(store.getAccessToken).toBe('acc');
    expect(removeItem).toHaveBeenCalledWith('token');
    expect(setItem).not.toHaveBeenCalled();
  });

  it('setUser / isLogin / clearUser', () => {
    const store = useAuthStore();
    const user = { id: 1, userName: 'alice' };
    store.setUser(user as never);
    expect(store.isLogin).toBe(true);
    // store 中 user 为 reactive 代理，使用深比较
    expect(store.getUser).toStrictEqual(user);

    store.clearUser();
    expect(store.isLogin).toBe(false);
    expect(store.getUser).toBeNull();
  });

  it('clearToken 清空字段并移除 localStorage', () => {
    const store = useAuthStore();
    store.setToken('acc', 'ref', 'Bearer');
    store.clearToken();

    expect(store.getAccessToken).toBe('');
    expect(store.getRefreshToken).toBe('');
    expect(store.getTokenType).toBe('');
    expect(removeItem).toHaveBeenCalledWith('token');
  });

  it('initial 无本地令牌时返回 false', async () => {
    getItem.mockReturnValue(null);
    const store = useAuthStore();
    expect(await store.initial()).toBe(false);
    expect(apiAuth.authMe).not.toHaveBeenCalled();
  });

  it('initial 令牌有效时恢复登录并设置 Authorization 头', async () => {
    getItem.mockReturnValue({
      accessToken: 'acc',
      refreshToken: 'ref',
      tokenType: 'Bearer',
    });
    const user = { id: 1, userName: 'alice' };
    apiAuth.authMe.mockResolvedValue({
      success: true,
      data: user as never,
      message: null,
    });

    const store = useAuthStore();
    expect(await store.initial()).toBe(true);

    expect(apiAuth.authMe).toHaveBeenCalledWith('Bearer', 'acc');
    // store 中 user 为 reactive 代理，使用深比较
    expect(store.getUser).toStrictEqual(user);
    expect(store.isLogin).toBe(true);
    expect(axios.defaults.headers.common['Authorization']).toBe('Bearer acc');
  });

  it('initial 令牌失效后通过 refreshToken 恢复', async () => {
    getItem.mockReturnValue({
      accessToken: 'acc',
      refreshToken: 'ref',
      tokenType: 'Bearer',
    });
    apiAuth.authMe.mockResolvedValue({
      success: false,
      data: null,
      message: 'expired',
    });
    apiAuth.refreshToken.mockResolvedValue({
      success: true,
      data: {
        accessToken: 'newAcc',
        refreshToken: 'newRef',
        tokenType: 'Bearer',
        user: { id: 2, userName: 'bob' },
      },
      message: null,
    });

    const store = useAuthStore();
    expect(await store.initial()).toBe(true);

    expect(apiAuth.refreshToken).toHaveBeenCalledWith('Bearer', 'ref');
    expect(store.getAccessToken).toBe('newAcc');
    expect(store.getUser?.userName).toBe('bob');
  });

  it('initial 令牌与刷新均失败时返回 false', async () => {
    getItem.mockReturnValue({
      accessToken: 'acc',
      refreshToken: 'ref',
      tokenType: 'Bearer',
    });
    apiAuth.authMe.mockResolvedValue({
      success: false,
      data: null,
      message: 'x',
    });
    apiAuth.refreshToken.mockResolvedValue({
      success: false,
      data: null,
      message: 'y',
    });

    const store = useAuthStore();
    expect(await store.initial()).toBe(false);
    expect(store.isLogin).toBe(false);
  });

  it('tokenRefresh 成功时更新令牌', async () => {
    apiAuth.refreshToken.mockResolvedValue({
      success: true,
      data: {
        accessToken: 'a2',
        refreshToken: 'r2',
        tokenType: 'Bearer',
        user: { id: 1, userName: 'alice' },
      },
      message: null,
    });

    const store = useAuthStore();
    store.setToken('a1', 'r1', 'Bearer');
    await store.tokenRefresh();

    expect(store.getAccessToken).toBe('a2');
    expect(store.getRefreshToken).toBe('r2');
  });

  it('tokenRefresh 失败时输出错误日志', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    apiAuth.refreshToken.mockResolvedValue({
      success: false,
      data: null,
      message: 'bad',
    });

    const store = useAuthStore();
    store.setToken('a1', 'r1', 'Bearer');
    await store.tokenRefresh();

    expect(errorSpy).toHaveBeenCalledWith('bad');
    expect(store.getAccessToken).toBe('a1');
  });

  it('setRedirectUrl / clearRedirectUrl / getRedirectUrl', () => {
    const store = useAuthStore();
    expect(store.getRedirectUrl).toBeNull();
    store.setRedirectUrl('/book/1');
    expect(store.getRedirectUrl).toBe('/book/1');
    store.clearRedirectUrl();
    expect(store.getRedirectUrl).toBeNull();
  });
});
