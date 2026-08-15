import { defineStore } from 'pinia';
import type { Book, BookReadingProgress } from '@guga-reading/types';
import { useApiBookReadingProgress } from '@guga-reading/shares';
import { useBookStore } from './useBookStore';
import { useMessage } from 'qyani-components';

type HistoryItem = BookReadingProgress & Book;

export const useReadingHistoryStore = defineStore('readingHistory', {
  state: () => ({
    readingHistory: [] as HistoryItem[],
    loading: false,
  }),
  getters: {
    getReadingHistory: (state) => state.readingHistory,
  },
  actions: {
    async get() {
      if (this.readingHistory.length > 0 || this.loading) {
        return;
      }
      this.loading = true;
      const { success, data } = await useApiBookReadingProgress.get();
      if (success) {
        const bookStore = useBookStore();
        const books = await bookStore.getBookByList(
          data!.map((item) => item.bookId),
        );
        const historyItems = data!.map((item) => ({
          ...item,
          ...books.find((book) => book.id === item.bookId),
        }));
        this.readingHistory = historyItems as HistoryItem[];
      }
      this.loading = false;
    },
    async update(bookId: number, chapterId: number, lastPosition: number = 0) {
      const index = this.readingHistory.findIndex((item) => item.id === bookId);
      if (index !== -1) {
        const [item] = this.readingHistory.splice(index, 1);
        item.lastChapterId = chapterId;
        item.lastPosition = lastPosition;
        this.readingHistory.unshift(item);
      } else {
        const [responseProgress, responseBook] = await Promise.all([
          useApiBookReadingProgress.update(bookId, chapterId, lastPosition),
          useBookStore().getBookById(bookId),
        ]);
        if (responseProgress.success) {
          this.readingHistory.unshift({
            ...responseBook,
            lastChapterId: chapterId,
            lastPosition: lastPosition,
            lastReadAt: new Date().toISOString(),
          } as HistoryItem);
        }
      }
    },
    async getSingle(bookId: number) {
      if (this.readingHistory.length <= 0) {
        await this.get();
      }
      return this.readingHistory.find((item) => item.bookId === bookId);
    },
    async delete(bookId: number) {
      const { success } = await useApiBookReadingProgress.delete(bookId);
      if (success) {
        const index = this.readingHistory.findIndex(
          (item) => item.bookId === bookId,
        );
        if (index !== -1) {
          this.readingHistory.splice(index, 1);
        }
        useMessage.success('删除成功');
      } else {
        useMessage.error('删除失败');
      }
    },
  },
});
