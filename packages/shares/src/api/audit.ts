import { get, patch } from '../utils';
import { Book, BookChapter } from '@guga-reading/types';

export const useApiAudit = {
  prefix: '/audit',
  getAuditBookChapter: async function () {
    return await get<BookChapter[]>(`${this.prefix}/chapter`);
  },
  getAuditBookChapterByOrders: async function (
    bookId: number,
    orders: number[],
  ) {
    return await get<BookChapter[]>(
      `${this.prefix}/chapterByOrder?bookId=${bookId}&orders=${orders.join('&orders=')}`,
    );
  },
  getAuditBook: async function (bookIds: number[] | undefined = undefined) {
    return await get<Book[]>(
      `${this.prefix}/book${bookIds ? `?bookIds=${bookIds.join('&bookIds=')}` : ''}`,
    );
  },
  patchAuditBook: async function (bookId: number, isPass: boolean) {
    return await patch(`${this.prefix}/book?bookId=${bookId}&isPass=${isPass}`);
  },
  getChapterContent: async function (bookId: number, orders: number[]) {
    return await get<string[]>(
      `${this.prefix}/content/chapter?bookId=${bookId}&orders=${orders.join('&orders=')}`,
    );
  },
  updateChapter: async function (
    bookId: number,
    chapterId: number,
    isPass: boolean,
  ) {
    return await patch(
      `${this.prefix}/chapter?bookId=${bookId}&chapterId=${chapterId}&isPass=${isPass}`,
    );
  },
};
