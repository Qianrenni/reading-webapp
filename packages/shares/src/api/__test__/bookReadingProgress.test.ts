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

import { useApiBookReadingProgress } from '../bookReadingProgress';

describe('useApiBookReadingProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.patch.mockResolvedValue({ success: true, data: null, message: null });
    mocks.get.mockResolvedValue({ success: true, data: [], message: null });
    mocks.del.mockResolvedValue({ success: true, data: null, message: null });
  });

  it('update 默认 lastPosition 为 0', async () => {
    await useApiBookReadingProgress.update(5, 10);
    expect(mocks.patch).toHaveBeenCalledWith('/user_reading_progress/add', {
      bookId: 5,
      lastChapterId: 10,
      lastPosition: 0,
    });
  });

  it('update 传入 lastPosition', async () => {
    await useApiBookReadingProgress.update(5, 10, 42);
    expect(mocks.patch).toHaveBeenCalledWith('/user_reading_progress/add', {
      bookId: 5,
      lastChapterId: 10,
      lastPosition: 42,
    });
  });

  it('get', async () => {
    await useApiBookReadingProgress.get();
    expect(mocks.get).toHaveBeenCalledWith('/user_reading_progress/get');
  });

  it('delete', async () => {
    await useApiBookReadingProgress.delete(5);
    expect(mocks.del).toHaveBeenCalledWith('/user_reading_progress/delete/5');
  });
});
