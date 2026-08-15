import { defineStore } from 'pinia';
import type { Book, Catalog } from '@guga-reading/types';
import { useApiBooks } from '@guga-reading/shares';
import { shareMemoryCache } from '@qianrenni/core';

/**
 * 缓存: 缓存书籍信息
 */
const cache = shareMemoryCache;

/**
 * @description 书籍Store,管理书籍获取等一系列状态,操作
 */
export const useBookStore = defineStore('book', {
  state: () => ({
    books: new Map<number, Book>(),
    cursors: new Map<string, number>(),
    categoryOvers: new Map<string, boolean>(),
    limit: 25,
    loading: false,
    scrollTo: 0,
    categories: [] as string[],
    currentCategory: '',
    booksSplitCategoryMap: new Map<string, number[]>(),
  }),
  getters: {
    getBooks: (state) => Array.from(state.books.values()),
    getScrollTo: (state) => state.scrollTo,
    getCategoryBook: (state) => {
      if (state.currentCategory === '') {
        return Array.from(state.books.values());
      } else {
        return Array.from(
          (state.booksSplitCategoryMap.get(state.currentCategory) || []).map(
            (id) => state.books.get(id)!,
          ),
        );
      }
    },
  },
  actions: {
    setScrollTo(scrollTo: number) {
      this.scrollTo = scrollTo;
    },
    setCurrentCategory(category: string) {
      this.currentCategory = category;
    },
    async addBookByCategory() {
      if (
        this.currentCategory === '' ||
        this.loading ||
        this.categoryOvers.get(this.currentCategory) ||
        false
      ) {
        return;
      }
      this.loading = true;
      const currentCategory = this.currentCategory;
      const { success, data } = await useApiBooks.getBookBySelect(
        currentCategory,
        this.cursors.get(currentCategory) || 0,
        this.limit,
      );
      if (success) {
        this.cursors.set(
          currentCategory,
          (this.cursors.get(currentCategory) || 0) + data!.length,
        );
        const previewBooks =
          this.booksSplitCategoryMap.get(currentCategory) || [];
        for (let i = 0; i < data!.length; i++) {
          this.books.set(data![i].id, data![i]);
          cache.set(`book_${data![i].id}`, data![i]);
          previewBooks.push(data![i].id);
        }
        this.booksSplitCategoryMap.set(currentCategory, previewBooks);
        if (data!.length === 0) {
          this.categoryOvers.set(currentCategory, true);
        }
      }
      this.loading = false;
    },
    async getBookById(id: number): Promise<Book> {
      const key = `book_${id}`;
      if (cache.has(key)) {
        return cache.get(key)!;
      }
      const isFinded = this.books.has(id);
      if (isFinded) {
        cache.set(key, this.books.get(id)!);
        return this.books.get(id)!;
      }
      const { success, data } = await useApiBooks.getBookById(id);
      if (success) {
        this.books.set(id, data!);
        cache.set(key, data!);
        return data!;
      }
      return {
        id: 0,
        name: '',
        author: '',
        cover: '',
        description: '',
      } as Book;
    },
    async getCatalogById(id: number): Promise<Catalog[]> {
      const key = `catalog_${id}`;
      if (cache.has(key)) {
        return cache.get(key)!;
      }
      const { success, data } = await useApiBooks.getCatalogById(id);
      if (success) {
        cache.set(key, data!);
        return data!;
      }
      return [];
    },
    async getBookByList(bookIds: number[]) {
      const booksFinded = [] as Book[];
      const booksNotFinded = [] as number[];
      for (const bookId of bookIds) {
        if (this.books.has(bookId)) {
          booksFinded.push(this.books.get(bookId)!);
        } else if (cache.has(`book_${bookId}`)) {
          booksFinded.push(cache.get(`book_${bookId}`)!);
        } else {
          booksNotFinded.push(bookId);
        }
      }
      if (booksNotFinded.length > 0) {
        const { success, data, message } =
          await useApiBooks.getBooksByList(booksNotFinded);
        if (success) {
          data!.forEach((book) => this.books.set(book.id, book));
          data!.forEach((book) => cache.set(`book_${book.id}`, book));
          booksFinded.push(...data!);
        } else {
          console.error(message);
        }
      }
      return booksFinded;
    },
    async getBookCategory() {
      const { success, data } = await useApiBooks.getBookCategory();
      if (success) {
        this.categories = data!.sort((a, b) => a.length - b.length);
      }
    },
  },
});
