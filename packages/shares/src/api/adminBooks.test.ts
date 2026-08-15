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

import { useApiAdminBooks } from './adminBooks';

describe('useApiAdminBooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.get.mockResolvedValue({ success: true, data: null, message: null });
    mocks.post.mockResolvedValue({ success: true, data: null, message: null });
    mocks.put.mockResolvedValue({ success: true, data: null, message: null });
    mocks.patch.mockResolvedValue({ success: true, data: null, message: null });
  });

  it('getBooks 携带分页参数', async () => {
    await useApiAdminBooks.getBooks(1, 20, 'kw');
    expect(mocks.get).toHaveBeenCalledWith('/admin/books', {
      params: { page: 1, size: 20, keyword: 'kw' },
    });
  });

  it('getBooks 可省略 keyword', async () => {
    await useApiAdminBooks.getBooks(1, 20);
    expect(mocks.get).toHaveBeenCalledWith('/admin/books', {
      params: { page: 1, size: 20, keyword: undefined },
    });
  });

  it('getBookById', async () => {
    await useApiAdminBooks.getBookById(5);
    expect(mocks.get).toHaveBeenCalledWith('/admin/books/5');
  });

  it('updateBook 用 put 提交 FormData', async () => {
    const formData = new FormData();
    formData.append('name', 'x');
    await useApiAdminBooks.updateBook(5, formData);
    expect(mocks.put).toHaveBeenCalledWith('/admin/books/5', formData);
  });

  it('uploadBook 用 post 提交 FormData', async () => {
    const formData = new FormData();
    await useApiAdminBooks.uploadBook(formData);
    expect(mocks.post).toHaveBeenCalledWith('/admin/books/upload', formData);
  });

  it('toggleBookStatus', async () => {
    await useApiAdminBooks.toggleBookStatus(5, false);
    expect(mocks.patch).toHaveBeenCalledWith('/admin/books/5/status', {
      isActive: false,
    });
  });
});
