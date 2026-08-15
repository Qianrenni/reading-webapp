import { del, get, post } from '../utils';
import type {
  BookComment,
  BookChapterComment,
  ChapterCommentsMap,
  PageResult,
} from '@guga-reading/types';

/**
 * 评论相关 API 封装
 * - 书评：公开读取列表、登录后发布/编辑/删除自己的书评
 * - 章节行评论：公开读取某章所有行评论、登录后发表/删除行评论
 */
export const useApiComments = {
  prefix: '/comment',

  /** 分页获取书评列表（公开） */
  getBookReviews: async function (
    bookId: number,
    page: number = 1,
    size: number = 20,
    parentId?: number,
  ) {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    });
    if (parentId !== undefined) {
      params.set('parentId', String(parentId));
    }
    return await get<PageResult<BookComment>>(
      `${this.prefix}/book/${bookId}?${params.toString()}`,
    );
  },

  /** 获取某章所有行评论，Map<行号, 评论列表>（公开） */
  getChapterComments: async function (bookId: number, chapterId: number) {
    return await get<ChapterCommentsMap>(
      `${this.prefix}/chapter/${bookId}/${chapterId}`,
    );
  },

  /** 获取自己的书评（登录） */
  getMyBookReview: async function (bookId: number) {
    return await get<BookComment | null>(`${this.prefix}/book/${bookId}/mine`);
  },

  /** 发布/编辑自己的书评（登录，UPSERT） */
  createBookReview: async function (bookId: number, content: string) {
    return await post<null>(`${this.prefix}/book/${bookId}`, { content });
  },

  /** 删除自己的书评（登录） */
  deleteBookReview: async function (bookId: number) {
    return await del<null>(`${this.prefix}/book/${bookId}`);
  },

  /** 发表/更新某行评论（登录，UPSERT） */
  createLineComment: async function (
    bookId: number,
    chapterId: number,
    line: number,
    content: string,
  ) {
    return await post<null>(`${this.prefix}/chapter/${bookId}/${chapterId}`, {
      line,
      content,
    });
  },

  /** 删除自己的某条行评论（登录） */
  deleteLineComment: async function (
    bookId: number,
    chapterId: number,
    commentId: number,
  ) {
    return await del<null>(
      `${this.prefix}/chapter/${bookId}/${chapterId}?commentId=${commentId}`,
    );
  },

  /** 获取某行评论（便捷方法：从整章映射中取出某行） */
  getLineComments: function (
    map: ChapterCommentsMap,
    line: number,
  ): BookChapterComment[] {
    return map[line] ?? [];
  },
};
