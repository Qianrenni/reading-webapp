import { defineStore } from 'pinia';
import type { Book } from '@guga-reading/types';
import { useApiBooks } from '@guga-reading/shares';

export const useBookSearchStore = defineStore('bookSearch', {
  state: () => ({
    searchKey: '',
    searchResult: [] as Book[],
    loading: false,
  }),
  getters: {
    getSearchKey: (state) => state.searchKey,
    getSearchResult: (state) => state.searchResult,
  },
  actions: {
    setSearchKey(searchKey: string) {
      this.searchKey = searchKey;
    },
    async searchBook() {
      const key = this.getSearchKey.trim();
      if (key.length < 1 || this.loading) {
        return;
      }
      this.loading = true;
      const { success, data } = await useApiBooks.searchBook(key);
      if (success) {
        this.searchResult = data!;
      }
      this.loading = false;
    },
  },
});
