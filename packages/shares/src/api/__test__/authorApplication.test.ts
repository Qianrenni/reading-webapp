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

import { useApiAuthorApplication } from '../authorApplication';

describe('useApiAuthorApplication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.post.mockResolvedValue({ success: true, data: null, message: null });
    mocks.get.mockResolvedValue({ success: true, data: null, message: null });
    mocks.patch.mockResolvedValue({ success: true, data: null, message: null });
  });

  it('apply 提交原因', async () => {
    await useApiAuthorApplication.apply('想写书');
    expect(mocks.post).toHaveBeenCalledWith('/author-application', {
      reason: '想写书',
    });
  });

  it('getMyApplication', async () => {
    await useApiAuthorApplication.getMyApplication();
    expect(mocks.get).toHaveBeenCalledWith('/author-application');
  });

  it('getApplications 无状态筛选', async () => {
    await useApiAuthorApplication.getApplications();
    expect(mocks.get).toHaveBeenCalledWith('/author-application/admin');
  });

  it('getApplications 带状态筛选', async () => {
    await useApiAuthorApplication.getApplications('PENDING');
    expect(mocks.get).toHaveBeenCalledWith(
      '/author-application/admin?status=PENDING',
    );
  });

  it('approve', async () => {
    await useApiAuthorApplication.approve(1);
    expect(mocks.patch).toHaveBeenCalledWith(
      '/author-application/admin/1/approve',
    );
  });

  it('reject 无原因时传 null', async () => {
    await useApiAuthorApplication.reject(1);
    expect(mocks.patch).toHaveBeenCalledWith(
      '/author-application/admin/1/reject',
      {
        rejectReason: null,
      },
    );
  });

  it('reject 带原因', async () => {
    await useApiAuthorApplication.reject(1, '理由不足');
    expect(mocks.patch).toHaveBeenCalledWith(
      '/author-application/admin/1/reject',
      {
        rejectReason: '理由不足',
      },
    );
  });
});
