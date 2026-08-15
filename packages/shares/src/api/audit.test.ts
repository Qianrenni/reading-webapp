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

import { useApiAudit } from './audit';

describe('useApiAudit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.get.mockResolvedValue({ success: true, data: [], message: null });
    mocks.patch.mockResolvedValue({ success: true, data: null, message: null });
  });

  it('getAuditBookChapter', async () => {
    await useApiAudit.getAuditBookChapter();
    expect(mocks.get).toHaveBeenCalledWith('/audit/chapter');
  });

  it('getAuditBookChapterByOrders 拼接 orders', async () => {
    await useApiAudit.getAuditBookChapterByOrders(1, [2, 3]);
    expect(mocks.get).toHaveBeenCalledWith(
      '/audit/chapterByOrder?bookId=1&orders=2&orders=3',
    );
  });

  it('getAuditBook 无 bookIds', async () => {
    await useApiAudit.getAuditBook();
    expect(mocks.get).toHaveBeenCalledWith('/audit/book');
  });

  it('getAuditBook 带 bookIds', async () => {
    await useApiAudit.getAuditBook([1, 2]);
    expect(mocks.get).toHaveBeenCalledWith('/audit/book?bookIds=1&bookIds=2');
  });

  it('patchAuditBook', async () => {
    await useApiAudit.patchAuditBook(1, true);
    expect(mocks.patch).toHaveBeenCalledWith(
      '/audit/book?bookId=1&isPass=true',
    );
  });

  it('getChapterContent 拼接 orders', async () => {
    await useApiAudit.getChapterContent(1, [2, 3]);
    expect(mocks.get).toHaveBeenCalledWith(
      '/audit/content/chapter?bookId=1&orders=2&orders=3',
    );
  });

  it('updateChapter', async () => {
    await useApiAudit.updateChapter(1, 2, false);
    expect(mocks.patch).toHaveBeenCalledWith(
      '/audit/chapter?bookId=1&chapterId=2&isPass=false',
    );
  });
});
