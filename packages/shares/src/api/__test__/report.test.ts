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

import { useApiReport } from '../report';

describe('useApiReport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.post.mockResolvedValue({ success: true, data: null, message: null });
  });

  it('reportChapterRead 上报事件', async () => {
    await useApiReport.reportChapterRead(5, 10, 'enter');
    expect(mocks.post).toHaveBeenCalledWith('/statistic/book-chapter', {
      bookId: 5,
      chapterId: 10,
      eventType: 'enter',
    });
  });

  it('支持 heartbeat / exit 事件类型', async () => {
    await useApiReport.reportChapterRead(5, 10, 'heartbeat');
    expect(mocks.post.mock.calls[0][1].eventType).toBe('heartbeat');

    await useApiReport.reportChapterRead(5, 10, 'exit');
    expect(mocks.post.mock.calls[1][1].eventType).toBe('exit');
  });
});
