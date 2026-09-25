import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  status: vi.fn(),
  exchange: vi.fn(),
}));

vi.mock('@guga-reading/shares', () => ({
  useApiQrLogin: {
    create: mocks.create,
    status: mocks.status,
    exchange: mocks.exchange,
  },
}));

import { useQrLogin } from '../useQrLogin';

/** 票据有效期给足，避免用例被本地过期判断干扰 */
const TICKET = {
  ticket: 't1',
  qrContent: 'gugareading://qr-login?ticket=t1',
  expiresIn: 300,
};
const TOKEN_DATA = {
  accessToken: 'access',
  refreshToken: 'refresh',
  tokenType: 'Bearer',
  user: { id: 1, userName: 'u', email: 'u@e.c', avatar: '', isActive: true },
};

describe('useQrLogin', () => {
  const createQrLogin = (options: Parameters<typeof useQrLogin>[0] = {}) =>
    useQrLogin({ autoStart: false, pollInterval: 1000, ...options });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mocks.create.mockResolvedValue({
      success: true,
      data: TICKET,
      message: '',
    });
    mocks.status.mockResolvedValue({
      success: true,
      data: { status: 'pending' },
      message: '',
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('取码成功后展示二维码内容并进入 pending', async () => {
    const qr = createQrLogin();

    await qr.refresh();

    expect(qr.qrContent.value).toBe(TICKET.qrContent);
    expect(qr.state.value).toBe('pending');
    expect(qr.tip.value).toContain('扫描');
  });

  it('取码失败进入 failed 并停止轮询', async () => {
    mocks.create.mockResolvedValue({
      success: false,
      data: null,
      message: '服务不可用',
    });
    const qr = createQrLogin();

    await qr.refresh();
    await vi.advanceTimersByTimeAsync(3000);

    expect(qr.state.value).toBe('failed');
    expect(qr.tip.value).toBe('服务不可用');
    expect(mocks.status).not.toHaveBeenCalled();
  });

  it('pending 状态持续轮询', async () => {
    const qr = createQrLogin();

    await qr.refresh();
    await vi.advanceTimersByTimeAsync(3000);

    expect(mocks.status).toHaveBeenCalledTimes(3);
    expect(qr.state.value).toBe('pending');
  });

  it('scanned 提示在手机上确认并继续轮询', async () => {
    mocks.status.mockResolvedValue({
      success: true,
      data: { status: 'scanned' },
      message: '',
    });
    const qr = createQrLogin();

    await qr.refresh();
    await vi.advanceTimersByTimeAsync(1000);

    expect(qr.state.value).toBe('scanned');
    expect(qr.tip.value).toContain('手机上确认');
    expect(mocks.status).toHaveBeenCalledTimes(1);
  });

  it('confirmed 时兑换令牌并回调 onSuccess，随后停止轮询', async () => {
    mocks.status.mockResolvedValue({
      success: true,
      data: { status: 'confirmed' },
      message: '',
    });
    mocks.exchange.mockResolvedValue({
      success: true,
      data: TOKEN_DATA,
      message: '',
    });
    const onSuccess = vi.fn();
    const qr = createQrLogin({ onSuccess });

    await qr.refresh();
    await vi.advanceTimersByTimeAsync(1000);

    expect(mocks.exchange).toHaveBeenCalledWith(TICKET.ticket);
    expect(qr.tokenData.value).toEqual(TOKEN_DATA);
    expect(onSuccess).toHaveBeenCalledWith(TOKEN_DATA);

    await vi.advanceTimersByTimeAsync(3000);
    expect(mocks.status).toHaveBeenCalledTimes(1);
  });

  it('兑换失败进入 failed', async () => {
    mocks.status.mockResolvedValue({
      success: true,
      data: { status: 'confirmed' },
      message: '',
    });
    mocks.exchange.mockResolvedValue({
      success: false,
      data: null,
      message: '二维码已过期，请刷新后重试',
    });
    const qr = createQrLogin();

    await qr.refresh();
    await vi.advanceTimersByTimeAsync(1000);

    expect(qr.state.value).toBe('failed');
    expect(qr.tokenData.value).toBeNull();
  });

  it('canceled 停止轮询', async () => {
    mocks.status.mockResolvedValue({
      success: true,
      data: { status: 'canceled' },
      message: '',
    });
    const qr = createQrLogin();

    await qr.refresh();
    await vi.advanceTimersByTimeAsync(3000);

    expect(qr.state.value).toBe('canceled');
    expect(mocks.status).toHaveBeenCalledTimes(1);
  });

  it('查询失败按过期处理，不继续轮询', async () => {
    mocks.status.mockResolvedValue({
      success: false,
      data: null,
      message: '二维码已过期，请刷新后重试',
    });
    const qr = createQrLogin();

    await qr.refresh();
    await vi.advanceTimersByTimeAsync(3000);

    expect(qr.state.value).toBe('expired');
    expect(qr.tip.value).toBe('二维码已过期，请刷新后重试');
    expect(mocks.status).toHaveBeenCalledTimes(1);
  });

  it('超过票据有效期后本地判定过期，不再请求状态', async () => {
    mocks.create.mockResolvedValue({
      success: true,
      data: { ...TICKET, expiresIn: 1 },
      message: '',
    });
    const qr = createQrLogin();

    await qr.refresh();
    await vi.advanceTimersByTimeAsync(1500);

    expect(qr.state.value).toBe('expired');
    expect(mocks.status).not.toHaveBeenCalled();
  });

  it('stop 后停止轮询', async () => {
    const qr = createQrLogin();

    await qr.refresh();
    qr.stop();
    await vi.advanceTimersByTimeAsync(5000);

    expect(mocks.status).not.toHaveBeenCalled();
  });

  it('refresh 会重新取码并清空上一次的令牌数据', async () => {
    mocks.status.mockResolvedValue({
      success: true,
      data: { status: 'confirmed' },
      message: '',
    });
    mocks.exchange.mockResolvedValue({
      success: true,
      data: TOKEN_DATA,
      message: '',
    });
    const qr = createQrLogin();

    await qr.refresh();
    await vi.advanceTimersByTimeAsync(1000);
    expect(qr.tokenData.value).toEqual(TOKEN_DATA);

    mocks.create.mockResolvedValue({
      success: true,
      data: {
        ticket: 't2',
        qrContent: 'gugareading://qr-login?ticket=t2',
        expiresIn: 300,
      },
      message: '',
    });
    mocks.status.mockResolvedValue({
      success: true,
      data: { status: 'pending' },
      message: '',
    });
    await qr.refresh();

    expect(qr.tokenData.value).toBeNull();
    expect(qr.state.value).toBe('pending');
    expect(qr.qrContent.value).toContain('t2');
  });
});
