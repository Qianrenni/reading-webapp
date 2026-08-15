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

import { useApiStatistic } from './statistic';

describe('useApiStatistic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.get.mockResolvedValue({ success: true, data: [], message: null });
  });

  it('getBookStatistics 默认 chapterId 为 -1', async () => {
    await useApiStatistic.getBookStatistics(5);
    expect(mocks.get).toHaveBeenCalledWith(
      '/author/book-statistics?bookId=5&chapterId=-1',
    );
  });

  it('getBookStatistics 指定章节', async () => {
    await useApiStatistic.getBookStatistics(5, 10);
    expect(mocks.get).toHaveBeenCalledWith(
      '/author/book-statistics?bookId=5&chapterId=10',
    );
  });
});
