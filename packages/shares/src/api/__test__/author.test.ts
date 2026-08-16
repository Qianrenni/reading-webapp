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

import { useApiAuthor } from '../author';

describe('useApiAuthor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.get.mockResolvedValue({ success: true, data: null, message: null });
    mocks.post.mockResolvedValue({ success: true, data: null, message: null });
    mocks.patch.mockResolvedValue({ success: true, data: null, message: null });
    mocks.del.mockResolvedValue({ success: true, data: null, message: null });
  });

  it('getAuthorCount', async () => {
    await useApiAuthor.getAuthorCount();
    expect(mocks.get).toHaveBeenCalledWith('/author/count');
  });

  it('getBook 无 id 时查询全部', async () => {
    await useApiAuthor.getBook();
    expect(mocks.get).toHaveBeenCalledWith('/author/book?');
  });

  it('getBook 带 id 时按 id 过滤', async () => {
    await useApiAuthor.getBook(3);
    expect(mocks.get).toHaveBeenCalledWith('/author/book?id=3');
  });

  it('createBook 组装 FormData 并 post', async () => {
    const cover = new File(['x'], 'cover.webp', { type: 'image/webp' });
    await useApiAuthor.createBook(
      '书名',
      '作者',
      cover,
      '简介',
      '玄幻',
      '热血',
    );

    expect(mocks.post).toHaveBeenCalledTimes(1);
    const [url, formData] = mocks.post.mock.calls[0];
    expect(url).toBe('/author/book');
    expect(formData).toBeInstanceOf(FormData);
    expect(formData.get('name')).toBe('书名');
    expect(formData.get('author')).toBe('作者');
    expect(formData.get('cover')).toBe(cover);
    expect(formData.get('category')).toBe('玄幻');
  });

  it('updateBook 带 id 且可省略 cover', async () => {
    const cover = new File(['x'], 'c.webp', { type: 'image/webp' });
    await useApiAuthor.updateBook(1, 'n', 'a', cover, 'd', 'c', 't');
    const [url, formData] = mocks.patch.mock.calls[0];
    expect(url).toBe('/author/book');
    expect(formData.get('id')).toBe('1');
    expect(formData.get('cover')).toBe(cover);

    mocks.patch.mockClear();
    // @ts-expect-error 测试 cover 为空时的分支
    await useApiAuthor.updateBook(1, 'n', 'a', null, 'd', 'c', 't');
    expect(mocks.patch.mock.calls[0][1].get('cover')).toBeNull();
  });

  it('deleteBook', async () => {
    await useApiAuthor.deleteBook(3);
    expect(mocks.del).toHaveBeenCalledWith('/author/book?id=3');
  });

  it('getBookChapter 无 chapterId', async () => {
    await useApiAuthor.getBookChapter(1);
    expect(mocks.get).toHaveBeenCalledWith('/author/chapter?bookId=1');
  });

  it('getBookChapter 拼接多个 chapterId', async () => {
    await useApiAuthor.getBookChapter(1, [2, 3]);
    expect(mocks.get).toHaveBeenCalledWith(
      '/author/chapter?bookId=1&chapterId=2&chapterId=3',
    );
  });

  it('updateBookChapter', async () => {
    await useApiAuthor.updateBookChapter(1, '标题', '内容', 2);
    expect(mocks.patch).toHaveBeenCalledWith('/author/chapter', {
      bookId: 1,
      title: '标题',
      content: '内容',
      order: 2,
    });
  });

  it('deleteBookChapter', async () => {
    await useApiAuthor.deleteBookChapter(1, 2);
    expect(mocks.del).toHaveBeenCalledWith(
      '/author/chapter?bookId=1&chapterId=2',
    );
  });

  it('getAuthorDraftChapter', async () => {
    await useApiAuthor.getAuthorDraftChapter();
    expect(mocks.get).toHaveBeenCalledWith('/author/draft/chapter');
  });

  it('updateStatusBookChapter / updateStatusBook', async () => {
    await useApiAuthor.updateStatusBookChapter(1, 2);
    expect(mocks.patch).toHaveBeenCalledWith(
      '/author/status/chapter?bookId=1&chapterId=2',
    );

    await useApiAuthor.updateStatusBook(1);
    expect(mocks.patch).toHaveBeenCalledWith('/author/status/book?bookId=1');
  });
});
