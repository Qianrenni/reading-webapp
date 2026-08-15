import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('@guga-reading/shares', () => ({
  useApiBooks: {
    getBookBySelect: vi.fn(),
    getBookById: vi.fn(),
    getCatalogById: vi.fn(),
    getBooksByList: vi.fn(),
    getBookCategory: vi.fn(),
  },
}));

import { useApiBooks } from '@guga-reading/shares';
import { useBookStore } from './useBookStore';

const book = (id: number, name = '书') => ({
  id,
  name,
  author: '作者',
  cover: '',
  description: '',
});

describe('useBookStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    // resetAllMocks 清除之前用例设置的 mock 实现，避免跨用例残留
    vi.resetAllMocks();
  });

  it('初始状态', () => {
    const store = useBookStore();
    expect(store.getBooks).toEqual([]);
    expect(store.limit).toBe(25);
    expect(store.currentCategory).toBe('');
  });

  it('addBookByCategory：未选分类直接返回', async () => {
    const store = useBookStore();
    await store.addBookByCategory();
    expect(useApiBooks.getBookBySelect).not.toHaveBeenCalled();
  });

  it('addBookByCategory 成功加载并推进游标', async () => {
    vi.mocked(useApiBooks.getBookBySelect).mockResolvedValue({
      success: true,
      data: [book(1001), book(1002)],
      message: null,
    });
    const store = useBookStore();
    store.setCurrentCategory('玄幻');
    await store.addBookByCategory();

    expect(useApiBooks.getBookBySelect).toHaveBeenCalledWith('玄幻', 0, 25);
    expect(store.cursors.get('玄幻')).toBe(2);
    expect(store.getCategoryBook.map((b) => b.id)).toEqual([1001, 1002]);
    expect(store.loading).toBe(false);
  });

  it('addBookByCategory 空数据标记分类已完结', async () => {
    vi.mocked(useApiBooks.getBookBySelect).mockResolvedValue({
      success: true,
      data: [],
      message: null,
    });
    const store = useBookStore();
    store.setCurrentCategory('完结');
    await store.addBookByCategory();
    expect(store.categoryOvers.get('完结')).toBe(true);
  });

  it('getBookById 命中内存缓存时不再请求', async () => {
    vi.mocked(useApiBooks.getBookById).mockResolvedValue({
      success: true,
      data: book(2001),
      message: null,
    });
    const store = useBookStore();
    const first = await store.getBookById(2001);
    expect(first.id).toBe(2001);

    vi.mocked(useApiBooks.getBookById).mockClear();
    const second = await store.getBookById(2001);
    expect(second.id).toBe(2001);
    expect(useApiBooks.getBookById).not.toHaveBeenCalled();
  });

  it('getBookById 请求失败返回默认空书', async () => {
    vi.mocked(useApiBooks.getBookById).mockResolvedValue({
      success: false,
      data: null,
      message: 'err',
    });
    const store = useBookStore();
    const result = await store.getBookById(3001);
    expect(result).toEqual({
      id: 0,
      name: '',
      author: '',
      cover: '',
      description: '',
    });
  });

  it('getCatalogById 成功缓存，失败返回空数组', async () => {
    vi.mocked(useApiBooks.getCatalogById).mockResolvedValue({
      success: true,
      data: [{ id: 1, title: '章' }],
      message: null,
    });
    const store = useBookStore();
    const catalog = await store.getCatalogById(4001);
    expect(catalog).toEqual([{ id: 1, title: '章' }]);

    vi.mocked(useApiBooks.getCatalogById).mockClear();
    await store.getCatalogById(4001);
    expect(useApiBooks.getCatalogById).not.toHaveBeenCalled();

    vi.mocked(useApiBooks.getCatalogById).mockResolvedValue({
      success: false,
      data: null,
      message: 'err',
    });
    expect(await store.getCatalogById(4002)).toEqual([]);
  });

  it('getBookByList 仅请求缺失的书籍', async () => {
    vi.mocked(useApiBooks.getBookById).mockResolvedValue({
      success: true,
      data: book(5002, '缓存书'),
      message: null,
    });
    vi.mocked(useApiBooks.getBooksByList).mockResolvedValue({
      success: true,
      data: [book(5003, '新书')],
      message: null,
    });
    const store = useBookStore();
    store.books.set(5001, book(5001));
    // 5002 经 getBookById 写入缓存、5003 缺失需请求
    await store.getBookById(5002);

    const result = await store.getBookByList([5001, 5002, 5003]);
    expect(result.map((b) => b.id).sort()).toEqual([5001, 5002, 5003]);
    expect(useApiBooks.getBooksByList).toHaveBeenCalledWith([5003]);
  });

  it('getBookCategory 按名称长度升序排序', async () => {
    vi.mocked(useApiBooks.getBookCategory).mockResolvedValue({
      success: true,
      data: ['玄幻', '都市', '奇幻修仙'],
      message: null,
    });
    const store = useBookStore();
    await store.getBookCategory();
    expect(store.categories).toEqual(['玄幻', '都市', '奇幻修仙']);
  });
});
