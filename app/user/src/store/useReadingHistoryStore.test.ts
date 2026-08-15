import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('@guga-reading/shares', () => ({
  useApiBookReadingProgress: {
    get: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  useApiBooks: {
    getBookBySelect: vi.fn(),
    getBookById: vi.fn(),
    getCatalogById: vi.fn(),
    getBooksByList: vi.fn(),
    getBookCategory: vi.fn(),
  },
}));

vi.mock('qyani-components', () => ({
  useMessage: { success: vi.fn(), error: vi.fn() },
}));

import { useApiBookReadingProgress, useApiBooks } from '@guga-reading/shares';
import { useMessage } from 'qyani-components';
import { useReadingHistoryStore } from './useReadingHistoryStore';

const book = (id: number, name = '书') => ({
  id,
  name,
  author: '作者',
  cover: '',
  description: '',
});

describe('useReadingHistoryStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('get：已有数据或 loading 时不重复请求', async () => {
    const store = useReadingHistoryStore();
    store.readingHistory = [{ id: 1 } as never];
    await store.get();
    expect(useApiBookReadingProgress.get).not.toHaveBeenCalled();
  });

  it('get：成功拉取并合并书籍信息', async () => {
    vi.mocked(useApiBookReadingProgress.get).mockResolvedValue({
      success: true,
      data: [
        { bookId: 7001, lastChapterId: 1, lastPosition: 0, lastReadAt: '' },
      ],
      message: null,
    });
    vi.mocked(useApiBooks.getBooksByList).mockResolvedValue({
      success: true,
      data: [book(7001, '书名')],
      message: null,
    });

    const store = useReadingHistoryStore();
    await store.get();

    expect(store.readingHistory).toHaveLength(1);
    expect(store.readingHistory[0].name).toBe('书名');
    expect(store.loading).toBe(false);
  });

  it('update：已存在记录移到最前并更新进度', async () => {
    const store = useReadingHistoryStore();
    store.readingHistory = [
      {
        id: 8001,
        bookId: 8001,
        lastChapterId: 1,
        lastPosition: 10,
        lastReadAt: 'a',
        name: 'b',
      } as never,
      {
        id: 8002,
        bookId: 8002,
        lastChapterId: 1,
        lastPosition: 0,
        lastReadAt: 'c',
        name: 'd',
      } as never,
    ];

    await store.update(8001, 5, 99);

    expect(store.readingHistory[0].lastChapterId).toBe(5);
    expect(store.readingHistory[0].lastPosition).toBe(99);
    expect(store.readingHistory[0].id).toBe(8001);
    expect(store.readingHistory).toHaveLength(2);
    // 未调用接口
    expect(useApiBookReadingProgress.update).not.toHaveBeenCalled();
  });

  it('update：不存在记录时请求接口并插入到最前', async () => {
    vi.mocked(useApiBookReadingProgress.update).mockResolvedValue({
      success: true,
      data: null,
      message: null,
    });
    vi.mocked(useApiBooks.getBookById).mockResolvedValue({
      success: true,
      data: book(9001, '新书'),
      message: null,
    });

    const store = useReadingHistoryStore();
    await store.update(9001, 3, 5);

    expect(useApiBookReadingProgress.update).toHaveBeenCalledWith(9001, 3, 5);
    expect(store.readingHistory).toHaveLength(1);
    expect(store.readingHistory[0].id).toBe(9001);
    expect(store.readingHistory[0].lastChapterId).toBe(3);
    expect(store.readingHistory[0].lastReadAt).toBeTypeOf('string');
  });

  it('getSingle：空列表时先拉取再查找', async () => {
    vi.mocked(useApiBookReadingProgress.get).mockResolvedValue({
      success: true,
      data: [
        { bookId: 7002, lastChapterId: 1, lastPosition: 0, lastReadAt: '' },
      ],
      message: null,
    });
    vi.mocked(useApiBooks.getBooksByList).mockResolvedValue({
      success: true,
      data: [book(7002)],
      message: null,
    });

    const store = useReadingHistoryStore();
    const item = await store.getSingle(7002);
    expect(item?.bookId).toBe(7002);
    expect(useApiBookReadingProgress.get).toHaveBeenCalled();
  });

  it('delete：成功后移除本地记录并提示', async () => {
    vi.mocked(useApiBookReadingProgress.delete).mockResolvedValue({
      success: true,
      data: null,
      message: null,
    });
    const store = useReadingHistoryStore();
    store.readingHistory = [
      { id: 8001, bookId: 8001 } as never,
      { id: 8002, bookId: 8002 } as never,
    ];

    await store.delete(8001);

    expect(useMessage.success).toHaveBeenCalledWith('删除成功');
    expect(store.readingHistory.map((i) => i.bookId)).toEqual([8002]);
  });

  it('delete：失败时提示错误', async () => {
    vi.mocked(useApiBookReadingProgress.delete).mockResolvedValue({
      success: false,
      data: null,
      message: 'err',
    });
    const store = useReadingHistoryStore();
    store.readingHistory = [{ bookId: 8001 } as never];

    await store.delete(8001);

    expect(useMessage.error).toHaveBeenCalledWith('删除失败');
    expect(store.readingHistory).toHaveLength(1);
  });
});
