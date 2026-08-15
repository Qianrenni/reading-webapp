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

import { useApiComments } from './comments';

describe('useApiComments', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.get.mockResolvedValue({ success: true, data: null, message: null });
    mocks.post.mockResolvedValue({ success: true, data: null, message: null });
    mocks.del.mockResolvedValue({ success: true, data: null, message: null });
  });

  it('getBookReviews 默认分页', async () => {
    await useApiComments.getBookReviews(5);
    expect(mocks.get).toHaveBeenCalledWith('/comment/book/5?page=1&size=20');
  });

  it('getBookReviews 带 parentId', async () => {
    await useApiComments.getBookReviews(5, 2, 10, 3);
    expect(mocks.get).toHaveBeenCalledWith(
      '/comment/book/5?page=2&size=10&parentId=3',
    );
  });

  it('getChapterComments', async () => {
    await useApiComments.getChapterComments(1, 2);
    expect(mocks.get).toHaveBeenCalledWith('/comment/chapter/1/2');
  });

  it('getMyBookReview', async () => {
    await useApiComments.getMyBookReview(5);
    expect(mocks.get).toHaveBeenCalledWith('/comment/book/5/mine');
  });

  it('createBookReview', async () => {
    await useApiComments.createBookReview(5, '书评内容');
    expect(mocks.post).toHaveBeenCalledWith('/comment/book/5', {
      content: '书评内容',
    });
  });

  it('deleteBookReview', async () => {
    await useApiComments.deleteBookReview(5);
    expect(mocks.del).toHaveBeenCalledWith('/comment/book/5');
  });

  it('createLineComment', async () => {
    await useApiComments.createLineComment(1, 2, 7, '行评论');
    expect(mocks.post).toHaveBeenCalledWith('/comment/chapter/1/2', {
      line: 7,
      content: '行评论',
    });
  });

  it('deleteLineComment 携带 commentId', async () => {
    await useApiComments.deleteLineComment(1, 2, 9);
    expect(mocks.del).toHaveBeenCalledWith('/comment/chapter/1/2?commentId=9');
  });

  it('getLineComments 从映射取某行，缺失返回空数组', () => {
    expect(useApiComments.getLineComments({ 1: [] }, 1)).toEqual([]);
    expect(
      useApiComments.getLineComments({ 1: [{ id: 1 } as never] }, 2),
    ).toEqual([]);
  });
});
