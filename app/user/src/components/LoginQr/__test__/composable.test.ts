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
import { defineComponent } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import axios from 'axios';

vi.mock('@guga-reading/shares', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@guga-reading/shares')>();
  return {
    ...actual,
    useApiQrLogin: {
      createQr: vi.fn(),
      qrStatus: vi.fn(),
      exchangeQr: vi.fn(),
    },
  };
});

vi.mock('qrcode', () => ({
  default: {
    toDataURL: vi.fn(
      async (content: string) => `data:image/png;base64,mock:${content}`,
    ),
  },
}));

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
  useApiQrLogin as realUseApiQrLogin,
  useAuthStore,
} from '@guga-reading/shares';
import { useMessage } from 'qyani-components';
import { useQrLogin, QR_LOGIN_SCHEME } from '../composable';

const useApiQrLogin = realUseApiQrLogin as unknown as {
  createQr: Mock;
  qrStatus: Mock;
  exchangeQr: Mock;
};

let ctx: ReturnType<typeof useQrLogin>;
const Host = defineComponent({
  setup() {
    ctx = useQrLogin();
  },
  template: '<div />',
});

describe('useQrLogin', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
    vi.useFakeTimers();
    useApiQrLogin.createQr.mockResolvedValue({
      success: true,
      data: { qrId: 'test-qr-id', expireSeconds: 300 },
      message: '操作成功',
    });
    useApiQrLogin.qrStatus.mockResolvedValue({
      success: true,
      data: { status: 'PENDING' },
      message: '操作成功',
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const mountHost = async () => {
    mount(Host);
    await flushPromises();
  };

  it('挂载后自动出码并开始轮询', async () => {
    await mountHost();
    expect(useApiQrLogin.createQr).toHaveBeenCalledTimes(1);
    expect(ctx.qrImageUrl.value).toBe(
      `data:image/png;base64,mock:${QR_LOGIN_SCHEME}test-qr-id`,
    );
    expect(ctx.status.value).toBe('PENDING');
    // 轮询进行中:推进一个周期后状态接口被调用
    await vi.advanceTimersByTimeAsync(3000);
    expect(useApiQrLogin.qrStatus).toHaveBeenCalledWith('test-qr-id');
  });

  it('轮询到 SCANNED 更新状态', async () => {
    useApiQrLogin.qrStatus.mockResolvedValue({
      success: true,
      data: { status: 'SCANNED', client: '网页端 Windows Chrome' },
      message: '操作成功',
    });
    await mountHost();
    await ctx.pollOnce();
    expect(ctx.status.value).toBe('SCANNED');
  });

  it('轮询到 CONFIRMED 领取 confirmToken 并兑换登录', async () => {
    useApiQrLogin.qrStatus.mockResolvedValue({
      success: true,
      data: { status: 'CONFIRMED', confirmToken: 'one-time-token' },
      message: '操作成功',
    });
    useApiQrLogin.exchangeQr.mockResolvedValue({
      success: true,
      data: {
        accessToken: 'access-1',
        refreshToken: 'refresh-1',
        tokenType: 'Bearer',
        user: {
          id: 1,
          userName: 'user1',
          email: 'a@b.c',
          avatar: '',
          isActive: true,
        },
      },
      message: '操作成功',
    });
    await mountHost();
    await ctx.pollOnce();
    await flushPromises();
    expect(useApiQrLogin.exchangeQr).toHaveBeenCalledWith('one-time-token');
    const authStore = useAuthStore();
    expect(authStore.getAccessToken).toBe('access-1');
    expect(authStore.getRefreshToken).toBe('refresh-1');
    expect(authStore.getUser?.id).toBe(1);
    expect(axios.defaults.headers.common['Authorization']).toBe(
      'Bearer access-1',
    );
    expect(ctx.status.value).toBe('CONFIRMED');
  });

  it('轮询到 EXPIRED/CANCELLED 停止轮询', async () => {
    useApiQrLogin.qrStatus.mockResolvedValue({
      success: true,
      data: { status: 'EXPIRED' },
      message: '操作成功',
    });
    await mountHost();
    await ctx.pollOnce();
    expect(ctx.status.value).toBe('EXPIRED');
    const callsAfterStop = useApiQrLogin.qrStatus.mock.calls.length;
    await vi.advanceTimersByTimeAsync(9000);
    expect(useApiQrLogin.qrStatus.mock.calls.length).toBe(callsAfterStop);
  });

  it('兑换失败提示并回到过期态', async () => {
    useApiQrLogin.qrStatus.mockResolvedValue({
      success: true,
      data: { status: 'CONFIRMED', confirmToken: 'used-token' },
      message: '操作成功',
    });
    useApiQrLogin.exchangeQr.mockResolvedValue({
      success: false,
      data: null,
      message: '登录确认已失效,请重新扫码',
    });
    await mountHost();
    await ctx.pollOnce();
    await flushPromises();
    expect(useMessage.error).toHaveBeenCalledWith('登录确认已失效,请重新扫码');
    expect(ctx.status.value).toBe('EXPIRED');
  });

  it('出码失败回到过期态引导刷新', async () => {
    useApiQrLogin.createQr.mockResolvedValue({
      success: false,
      data: null,
      message: '服务器繁忙',
    });
    await mountHost();
    expect(useMessage.error).toHaveBeenCalledWith('服务器繁忙');
    expect(ctx.status.value).toBe('EXPIRED');
  });

  it('卸载时停止轮询', async () => {
    const wrapper = mount(Host);
    await flushPromises();
    wrapper.unmount();
    const calls = useApiQrLogin.qrStatus.mock.calls.length;
    await vi.advanceTimersByTimeAsync(9000);
    expect(useApiQrLogin.qrStatus.mock.calls.length).toBe(calls);
  });
});
