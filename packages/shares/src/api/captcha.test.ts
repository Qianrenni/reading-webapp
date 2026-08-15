// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';

vi.mock('axios', () => ({
  default: { get: vi.fn() },
}));

// 直接使用真实模块（axios 已被 mock）
import { useApiCaptcha } from './captcha';

describe('useApiCaptcha', () => {
  const axiosGetMock = vi.mocked(axios.get);

  beforeEach(() => {
    axiosGetMock.mockReset();
    // jsdom 不提供 URL.createObjectURL
    Object.defineProperty(URL, 'createObjectURL', {
      configurable: true,
      value: vi.fn(() => 'blob:mock-url'),
    });
  });

  afterEach(() => {
    Reflect.deleteProperty(URL, 'createObjectURL');
  });

  it('请求成功时返回图片地址与验证码 ID', async () => {
    axiosGetMock.mockResolvedValue({
      statusText: 'OK',
      data: new Blob(['img'], { type: 'image/png' }),
      headers: { 'x-captcha-id': 'cap-123' },
    });

    const result = await useApiCaptcha.getCaptcha();
    expect(axiosGetMock).toHaveBeenCalledWith('/captcha/get', {
      responseType: 'blob',
    });
    expect(result).toEqual({
      imageUrl: 'blob:mock-url',
      x_captcha_id: 'cap-123',
    });
  });

  it('statusText 非 OK 时不返回结果', async () => {
    axiosGetMock.mockResolvedValue({
      statusText: 'ERROR',
      data: new Blob(['x']),
      headers: {},
    });

    const result = await useApiCaptcha.getCaptcha();
    expect(result).toBeUndefined();
  });
});
