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

import { useApiBookShelf } from '../bookShelf';

describe('useApiBookShelf', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.post.mockResolvedValue({ success: true, data: null, message: null });
    mocks.get.mockResolvedValue({ success: true, data: [], message: null });
    mocks.del.mockResolvedValue({ success: true, data: null, message: null });
  });

  it('add', async () => {
    await useApiBookShelf.add(5);
    expect(mocks.post).toHaveBeenCalledWith('/shelf/add', { bookId: 5 });
  });

  it('get', async () => {
    await useApiBookShelf.get();
    expect(mocks.get).toHaveBeenCalledWith('/shelf/get');
  });

  it('delete', async () => {
    await useApiBookShelf.delete(5);
    expect(mocks.del).toHaveBeenCalledWith('/shelf/delete/5');
  });
});
