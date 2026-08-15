import { get } from '../utils';
import type { Book, Catalog } from '@guga-reading/types';

export const useApiBooks = {
  getBookReadCount: async function (bookId: number) {
    return await get<number>(`${this.prefix}/${bookId}/read-count`);
  },
  getBookFavoriteCount: async function (bookId: number) {
    return await get<number>(`${this.prefix}/${bookId}/favorite-count`);
  },
  prefix: '/book',
  getBookCount: async function () {
    return await get<number>(`${this.prefix}/count`);
  },
  getBooksByList: async function (bookIds: number[]) {
    return await get<Book[]>(
      `${this.prefix}/list?${bookIds.map((id) => `bookIds=${id}`).join('&')}`,
    );
  },
  getTotalBookCount: async function () {
    return await get<{ total: number }>(`${this.prefix}/total`);
  },
  getBookById: async function (id: number) {
    return await get<Book>(`${this.prefix}/${id}`);
  },
  getCatalogById: async function (id: number) {
    return await get<Catalog[]>(`${this.prefix}/toc/${id}`);
  },
  getBookChapterById: async function (bookId: number, chapterId: number) {
    return await get<string>(
      `${this.prefix}/chapter/${chapterId}?bookId=${bookId}`,
    );
  },
  searchBook: async function (key: string) {
    return await get<Book[]>(`${this.prefix}/search?q=${key}`);
  },
  getBookCategory: async function () {
    return await get<string[]>(`${this.prefix}/category`);
  },
  getBookBySelect: async function (
    category: string,
    offset: number,
    limit: number,
  ) {
    return await get<Book[]>(
      `${this.prefix}/select?category=${category}&offset=${offset}&limit=${limit}`,
    );
  },
  getRecommendBook: async function (tags: string) {
    return await get<Book[]>(`${this.prefix}/recommend?query=${tags}`);
  },
};
