import { del, get, patch, post } from '../utils';
import type { Book, BookChapter } from '@guga-reading/types';
export const useApiAuthor = {
  prefix: '/author',
  getAuthorCount: async function () {
    return await get<number>(`${this.prefix}/count`);
  },
  getBook: async function (id: number = -1) {
    return await get<Book[]>(
      `${this.prefix}/book?${id != -1 ? `id=${id}` : ''}`,
    );
  },
  /**
   * 创建书籍
   * @param name  书籍名称
   * @param author  作者
   * @param cover  封面
   * @param description  描述
   * @param category  类别
   * @param tags  标签
   * @returns
   */
  createBook: async function (
    name: string,
    author: string,
    cover: File,
    description: string,
    category: string,
    tags: string,
  ) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('author', author);
    formData.append('cover', cover);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('tags', tags);
    return await post<null>(`${this.prefix}/book`, formData);
  },
  updateBook: async function (
    id: number,
    name: string,
    author: string,
    cover: File,
    description: string,
    category: string,
    tags: string,
  ) {
    const formData = new FormData();
    formData.append('id', id.toString());
    formData.append('name', name);
    formData.append('author', author);
    if (cover) {
      formData.append('cover', cover);
    }
    formData.append('description', description);
    formData.append('category', category);
    formData.append('tags', tags);
    return await patch<null>(`${this.prefix}/book`, formData);
  },
  deleteBook: async function (id: number) {
    return await del<null>(`${this.prefix}/book?id=${id}`);
  },
  getBookChapter: async function (bookId: number, chapterId?: number[]) {
    return await get<BookChapter[]>(
      `${this.prefix}/chapter?bookId=${bookId}${chapterId ? `&chapterId=${chapterId.join('&chapterId=')}` : ''}`,
    );
  },
  updateBookChapter: async function (
    bookId: number,
    title: string,
    content: string,
    order: number,
  ) {
    return await patch<null>(`${this.prefix}/chapter`, {
      bookId: bookId,
      title,
      content,
      order,
    });
  },
  deleteBookChapter: async function (bookId: number, chapterId: number) {
    return await del<null>(
      `${this.prefix}/chapter?bookId=${bookId}&chapterId=${chapterId}`,
    );
  },
  getBookChapterContent: async function (bookId: number, chapterId: number[]) {
    return await get<string[]>(
      `${this.prefix}/content?bookId=${bookId}${`&chapterId=${chapterId.join('&chapterId=')}`}`,
    );
  },
  getAuthorDraftChapter: async function () {
    return await get<BookChapter[]>(`${this.prefix}/draft/chapter`);
  },
  updateStatusBookChapter: async function (bookId: number, chapterId: number) {
    return await patch<null>(
      `${this.prefix}/status/chapter?bookId=${bookId}&chapterId=${chapterId}`,
    );
  },
  updateStatusBook: async function (bookId: number) {
    return await patch<null>(`${this.prefix}/status/book?bookId=${bookId}`);
  },
};
