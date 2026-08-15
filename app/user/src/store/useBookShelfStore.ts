import { defineStore } from 'pinia';
import type { ShelfItem } from '@guga-reading/types';
import { useReadingHistoryStore } from './useReadingHistoryStore';
import { useBookStore } from './useBookStore';
import { useMessage } from 'qyani-components';
import { useApiBookShelf } from '@guga-reading/shares';

export const useBookShelfStore = defineStore('bookShelf', {
  state: () => ({
    bookShelf: [] as ShelfItem[],
    loading: false,
  }),
  getters: {
    getBookShelf: (state) => state.bookShelf,
  },
  actions: {
    async get() {
      if (this.bookShelf.length > 0 || this.loading) {
        return;
      }
      this.loading = true;
      const { success, data } = await useApiBookShelf.get();
      if (success && data!.length > 0) {
        const bookStore = useBookStore();
        const readingHistoryStore = useReadingHistoryStore();
        const books = await bookStore.getBookByList(
          data!.map((item) => item.bookId),
        );
        const historyItems = (
          await Promise.all(
            data!.map((item) => readingHistoryStore.getSingle(item.bookId)),
          )
        ).filter((item) => item !== undefined);
        const shelfItems = data!.map((item) => ({
          ...item,
          ...books.find((book) => book.id === item.bookId),
          ...(historyItems.find(
            (historyItem) => historyItem.bookId === item.bookId,
          ) ?? {
            lastChapterId: -1,
            lastPosition: 0,
            lastReadAt: '',
          }),
        }));
        this.bookShelf = shelfItems as ShelfItem[];
      }
      this.loading = false;
    },
    async add(bookId: number) {
      if (this.bookShelf.findIndex((item) => item.bookId === bookId) !== -1) {
        return;
      }
      const bookStore = useBookStore();
      const readingHistoryStore = useReadingHistoryStore();
      const [responseAdd, book, history] = await Promise.all([
        useApiBookShelf.add(bookId),
        bookStore.getBookById(bookId),
        readingHistoryStore.getSingle(bookId),
      ]);

      if (responseAdd.success) {
        this.bookShelf.unshift({
          ...book,
          ...(history ?? {
            lastChapterId: -1,
            lastPosition: 0,
            lastReadAt: '',
          }),
        } as ShelfItem);
      }
      useMessage.success('添加成功');
    },
    async delete(bookId: number) {
      const { success } = await useApiBookShelf.delete(bookId);
      if (success) {
        const index = this.bookShelf.findIndex(
          (item) => item.bookId === bookId,
        );
        if (index !== -1) {
          this.bookShelf.splice(index, 1);
        }
        useMessage.success('删除成功');
      } else {
        useMessage.error('删除失败');
      }
    },
  },
});
