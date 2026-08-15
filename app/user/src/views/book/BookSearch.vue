<template>
  <div class="container-w100">
    <QScrollContainer
      v-show="!bookSearchStore.loading"
      scroll-Y
      class="scroll-container search-container"
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
      class="container-w100 loading"
      type="skeleton"
    />
  </div>
</template>
<script setup lang="ts">
import { useBookSearchStore } from '@/store/useBookSearchStore';
import BookItem from '@/components/BookItem.vue';
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
  display: grid;
  grid-template-columns: repeat(auto-fill, 350px);
  grid-auto-rows: 120px;
  gap: 1rem;
  padding: 1rem;
}
</style>
