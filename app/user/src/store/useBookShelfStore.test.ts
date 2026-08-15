import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('@guga-reading/shares', () => ({
  useApiBookShelf: {
    get: vi.fn(),
    add: vi.fn(),
    delete: vi.fn(),
  },
  useApiBooks: {
    getBookBySelect: vi.fn(),
    getBookById: vi.fn(),
    getCatalogById: vi.fn(),
    getBooksByList: vi.fn(),
    getBookCategory: vi.fn(),
  },
  useApiBookReadingProgress: {
    get: vi.fn().mockResolvedValue({ success: true, data: [], message: null }),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('qyani-components', () => ({
  useMessage: { success: vi.fn(), error: vi.fn() },
}));

import { useApiBookShelf, useApiBooks } from '@guga-reading/shares';
import { useMessage } from 'qyani-components';
import { useBookShelfStore } from './useBookShelfStore';

const book = (id: number, name = '书') => ({
  id,
  name,
  author: '作者',
  cover: '',
  description: '',
});

describe('useBookShelfStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('get：已有数据时不重复请求', async () => {
    const store = useBookShelfStore();
    store.bookShelf = [{ bookId: 1 } as never];
    await store.get();
    expect(useApiBookShelf.get).not.toHaveBeenCalled();
  });

  it('get：成功拉取并合并书籍与阅读进度', async () => {
    vi.mocked(useApiBookShelf.get).mockResolvedValue({
      success: true,
      data: [{ bookId: 10001, createdAt: '2024-01-01' }],
      message: null,
    });
    vi.mocked(useApiBooks.getBooksByList).mockResolvedValue({
      success: true,
      data: [book(10001, '书架书')],
      message: null,
    });

    const store = useBookShelfStore();
    await store.get();

    expect(store.bookShelf).toHaveLength(1);
    expect(store.bookShelf[0].name).toBe('书架书');
    // 无历史时使用默认进度
    expect(store.bookShelf[0].lastChapterId).toBe(-1);
    expect(store.bookShelf[0].lastPosition).toBe(0);
    expect(store.loading).toBe(false);
  });

  it('add：已存在书籍直接返回', async () => {
    const store = useBookShelfStore();
    store.bookShelf = [{ bookId: 20001 } as never];
    await store.add(20001);
    expect(useApiBookShelf.add).not.toHaveBeenCalled();
  });

  it('add：成功后插入书架并提示', async () => {
    vi.mocked(useApiBookShelf.add).mockResolvedValue({
      success: true,
      data: null,
      message: null,
    });
    vi.mocked(useApiBooks.getBookById).mockResolvedValue({
      success: true,
      data: book(20002, '新收藏'),
      message: null,
    });

    const store = useBookShelfStore();
    await store.add(20002);

    expect(useMessage.success).toHaveBeenCalledWith('添加成功');
    expect(store.bookShelf[0].name).toBe('新收藏');
    expect(store.bookShelf[0].lastChapterId).toBe(-1);
  });

  it('delete：成功后移除并提示', async () => {
    vi.mocked(useApiBookShelf.delete).mockResolvedValue({
      success: true,
      data: null,
      message: null,
    });
    const store = useBookShelfStore();
    store.bookShelf = [{ bookId: 30001 } as never, { bookId: 30002 } as never];

    await store.delete(30001);

    expect(useMessage.success).toHaveBeenCalledWith('删除成功');
    expect(store.bookShelf.map((i) => i.bookId)).toEqual([30002]);
  });

  it('delete：失败时提示错误', async () => {
    vi.mocked(useApiBookShelf.delete).mockResolvedValue({
      success: false,
      data: null,
      message: 'err',
    });
    const store = useBookShelfStore();
    store.bookShelf = [{ bookId: 30001 } as never];

    await store.delete(30001);

    expect(useMessage.error).toHaveBeenCalledWith('删除失败');
    expect(store.bookShelf).toHaveLength(1);
  });
});
