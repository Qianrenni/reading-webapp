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

import { useApiBooks } from '../books';

describe('useApiBooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.get.mockResolvedValue({ success: true, data: null, message: null });
  });

  it('getBookById', async () => {
    await useApiBooks.getBookById(5);
    expect(mocks.get).toHaveBeenCalledWith('/book/5');
  });

  it('getBookCount', async () => {
    await useApiBooks.getBookCount();
    expect(mocks.get).toHaveBeenCalledWith('/book/count');
  });

  it('getBookReadCount', async () => {
    await useApiBooks.getBookReadCount(5);
    expect(mocks.get).toHaveBeenCalledWith('/book/5/read-count');
  });

  it('getBookFavoriteCount', async () => {
    await useApiBooks.getBookFavoriteCount(5);
    expect(mocks.get).toHaveBeenCalledWith('/book/5/favorite-count');
  });

  it('getBooksByList 拼接多个 bookIds', async () => {
    await useApiBooks.getBooksByList([1, 2, 3]);
    expect(mocks.get).toHaveBeenCalledWith(
      '/book/list?bookIds=1&bookIds=2&bookIds=3',
    );
  });

  it('getTotalBookCount', async () => {
    await useApiBooks.getTotalBookCount();
    expect(mocks.get).toHaveBeenCalledWith('/book/total');
  });

  it('getCatalogById', async () => {
    await useApiBooks.getCatalogById(5);
    expect(mocks.get).toHaveBeenCalledWith('/book/toc/5');
  });

  it('getBookChapterById 携带 bookId', async () => {
    await useApiBooks.getBookChapterById(5, 10);
    expect(mocks.get).toHaveBeenCalledWith('/book/chapter/10?bookId=5');
  });

  it('searchBook 携带关键字', async () => {
    await useApiBooks.searchBook('abc');
    expect(mocks.get).toHaveBeenCalledWith('/book/search?q=abc');
  });

  it('getBookCategory', async () => {
    await useApiBooks.getBookCategory();
    expect(mocks.get).toHaveBeenCalledWith('/book/category');
  });

  it('getBookBySelect 拼接分类/偏移/条数', async () => {
    await useApiBooks.getBookBySelect('玄幻', 20, 25);
    expect(mocks.get).toHaveBeenCalledWith(
      '/book/select?category=玄幻&offset=20&limit=25',
    );
  });

  it('getRecommendBook 携带 query', async () => {
    await useApiBooks.getRecommendBook('热血');
    expect(mocks.get).toHaveBeenCalledWith('/book/recommend?query=热血');
  });
});
