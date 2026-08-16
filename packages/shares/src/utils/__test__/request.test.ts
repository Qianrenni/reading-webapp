import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import { get, post, put, del, patch } from '../request';

describe('request 响应处理', () => {
  const baseUrl = '/api';

  beforeEach(() => {
    vi.spyOn(axios, 'get');
    vi.spyOn(axios, 'post');
    vi.spyOn(axios, 'put');
    vi.spyOn(axios, 'delete');
    vi.spyOn(axios, 'patch');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('JSON + code=0 时视为成功并返回数据', async () => {
    (axios.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      headers: { 'content-type': 'application/json' },
      data: { code: 0, data: { id: 1 }, message: 'ok' },
    });

    const result = await get<{ id: number }>(baseUrl);
    expect(result).toEqual({ success: true, data: { id: 1 }, message: 'ok' });
  });

  it('JSON + code=1 时视为失败', async () => {
    (axios.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      headers: { 'content-type': 'application/json' },
      data: { code: 1, data: null, message: '业务失败' },
    });

    const result = await get<null>(baseUrl);
    expect(result).toEqual({
      success: false,
      data: null,
      message: '业务失败',
    });
  });

  it('非 JSON 响应按 HTTP 状态判断成功与否', async () => {
    (axios.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      headers: { 'content-type': 'text/plain' },
      data: 'ok',
    });

    const result = await get<null>(baseUrl);
    expect(result).toEqual({ success: true, data: null, message: '操作成功' });
  });

  it('HTTP 错误状态且非 JSON 时返回失败', async () => {
    (axios.get as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 500,
      headers: { 'content-type': 'text/plain' },
      data: 'error',
    });

    const result = await get<null>(baseUrl);
    expect(result).toEqual({ success: false, data: null, message: '操作失败' });
  });

  it('post/put/del/patch 转发到对应 axios 方法', async () => {
    (axios.post as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      headers: { 'content-type': 'application/json' },
      data: { code: 0, data: null, message: 'ok' },
    });
    (axios.put as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      headers: { 'content-type': 'application/json' },
      data: { code: 0, data: null, message: 'ok' },
    });
    (axios.delete as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      headers: { 'content-type': 'application/json' },
      data: { code: 0, data: null, message: 'ok' },
    });
    (axios.patch as ReturnType<typeof vi.fn>).mockResolvedValue({
      status: 200,
      headers: { 'content-type': 'application/json' },
      data: { code: 0, data: null, message: 'ok' },
    });

    await post('/post', { a: 1 });
    expect(axios.post).toHaveBeenCalledWith('/post', { a: 1 });

    await put('/put', { b: 2 });
    expect(axios.put).toHaveBeenCalledWith('/put', { b: 2 });

    await del('/delete');
    expect(axios.delete).toHaveBeenCalledWith('/delete');

    await patch('/patch', { c: 3 });
    expect(axios.patch).toHaveBeenCalledWith('/patch', { c: 3 });
  });
});
