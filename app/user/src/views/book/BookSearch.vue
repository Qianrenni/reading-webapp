<template>
  <section class="w-full">
    <QScrollContainer
      v-show="!bookSearchStore.loading"
      scroll-Y
      class="scroll-container grid gap-6 p-6 search-container"
    >
      <BookItem
        v-for="book in bookSearchStore.getSearchResult"
        :key="book.id"
        :book="book"
        :width="width"
        :height="height"
      />
    </QScrollContainer>
    <QLoading
      v-show="bookSearchStore.loading"
      class="w-full loading"
      type="skeleton"
    />
  </section>
</template>
<script setup lang="ts">
import { useBookSearchStore } from '@/store/useBookSearchStore';
import { BookItem } from '@/components/BookItem';
import { QScrollContainer, QLoading } from 'qyani-components';
defineOptions({
  name: 'BookSearch',
});
const bookSearchStore = useBookSearchStore();
const width = 90;
const height = 120;
</script>
<style scoped lang="css">
.search-container {
  grid-template-columns: repeat(auto-fill, 350px);
  grid-auto-rows: 120px;
}
</style>
