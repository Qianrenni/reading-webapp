// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { defineComponent } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import axios from 'axios';

vi.mock('@guga-reading/shares', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@guga-reading/shares')>();
  return {
    ...actual,
    useApiCaptcha: { getCaptcha: vi.fn() },
    useApiAuth: {
      login: vi.fn(),
      authMe: vi
        .fn()
        .mockResolvedValue({ success: false, data: null, message: null }),
      refreshToken: vi
        .fn()
        .mockResolvedValue({ success: false, data: null, message: null }),
    },
  };
});

vi.mock('qyani-components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('qyani-components')>();
  return {
    ...actual,
    useMessage: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn(),
    },
  };
});

import {
  useApiAuth as realUseApiAuth,
  useApiCaptcha as realUseApiCaptcha,
  useAuthStore,
} from '@guga-reading/shares';
import { useMessage } from 'qyani-components';
import { useLoginForm } from '../composable';

const useApiAuth = realUseApiAuth as unknown as {
  login: Mock;
  authMe: Mock;
  refreshToken: Mock;
};
const useApiCaptcha = realUseApiCaptcha as unknown as {
  getCaptcha: Mock;
};

let ctx: ReturnType<typeof useLoginForm>;
const Host = defineComponent({
  setup() {
    ctx = useLoginForm();
    return ctx;
  },
  template: '<div />',
});

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<div/>' } }],
  });
}

describe('useLoginForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
    vi.mocked(useApiCaptcha.getCaptcha).mockResolvedValue({
      x_captcha_id: 'cid',
      imageUrl: 'blob:img',
    });
  });

  it('挂载时刷新验证码并写入表单', async () => {
    const pinia = createPinia();
    setActivePinia(pinia);
    mount(Host, {
      global: { plugins: [pinia, makeRouter()] },
    });
    await flushPromises();

    expect(ctx.image.value).toBe('blob:img');
    expect(ctx.form.value.x_captcha_id).toBe('cid');
  });

  it('run 登录成功：设置令牌、用户与 Authorization 头', async () => {
    vi.mocked(useApiAuth.login).mockResolvedValue({
      success: true,
      data: {
        accessToken: 'acc',
        refreshToken: 'ref',
        tokenType: 'Bearer',
        user: { id: 1, userName: 'alice' },
      },
      message: null,
    });

    const pinia = createPinia();
    setActivePinia(pinia);
    mount(Host, { global: { plugins: [pinia, makeRouter()] } });
    await flushPromises();

    ctx.form.value.username = 'user';
    ctx.form.value.password = 'pass';
    ctx.form.value.captcha = 'cap';
    await ctx.run();

    expect(useApiAuth.login).toHaveBeenCalledWith('user', 'pass', 'cap', 'cid');
    expect(useMessage.success).toHaveBeenCalledWith('登录成功');
    expect(useAuthStore().getAccessToken).toBe('acc');
    expect(useAuthStore().getUser?.userName).toBe('alice');
    expect(axios.defaults.headers.common['Authorization']).toBe('Bearer acc');
  });

  it('run 登录失败：提示错误并刷新验证码', async () => {
    vi.mocked(useApiAuth.login).mockResolvedValue({
      success: false,
      data: null,
      message: '用户名或密码错误',
    });

    const pinia = createPinia();
    setActivePinia(pinia);
    mount(Host, { global: { plugins: [pinia, makeRouter()] } });
    await flushPromises();
    // 挂载时已刷新过一次验证码，清空调用记录以验证失败时会再次刷新
    vi.mocked(useApiCaptcha.getCaptcha).mockClear();

    await ctx.run();

    expect(useMessage.error).toHaveBeenCalledWith('用户名或密码错误');
    expect(useApiCaptcha.getCaptcha).toHaveBeenCalled();
    expect(useAuthStore().isLogin).toBe(false);
  });

  it('记住我勾选时 setRemember 为 true', async () => {
    vi.mocked(useApiAuth.login).mockResolvedValue({
      success: true,
      data: {
        accessToken: 'acc',
        refreshToken: 'ref',
        tokenType: 'Bearer',
        user: { id: 1, userName: 'alice' },
      },
      message: null,
    });

    const pinia = createPinia();
    setActivePinia(pinia);
    mount(Host, { global: { plugins: [pinia, makeRouter()] } });
    await flushPromises();

    ctx.form.value.remember = ['remember'];
    await ctx.run();

    expect(useAuthStore().isRemember).toBe(true);
  });
});
