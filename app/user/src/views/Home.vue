<script setup lang="ts">
import { useBookStore } from '@/store';
import {
  onActivated,
  onBeforeMount,
  onMounted,
  ref,
  useTemplateRef,
  watch,
} from 'vue';
import { BookItem, BookItemSkeleton } from '@/components/BookItem';
import { QScrollContainer } from 'qyani-components';

defineOptions({
  name: 'Home',
});
const bookStore = useBookStore();
const width = 90;
const height = 120;
const refScrollContainer =
  useTemplateRef<InstanceType<typeof QScrollContainer>>('home-container');
const selectedCategory = ref(bookStore.currentCategory ?? '');

watch(
  () => selectedCategory.value,
  (newValue) => {
    bookStore.setCurrentCategory(newValue);
    bookStore.addBookByCategory();
  },
);

onBeforeMount(async () => {
  bookStore.getBookCategory().then(() => {
    if (selectedCategory.value == '' && bookStore.categories.length > 0) {
      const firstCategory = bookStore.categories[0];
      if (firstCategory !== undefined) {
        selectedCategory.value = firstCategory;
      }
    }
  });
});
onMounted(() => {
  refScrollContainer.value?.scrollTo({
    top: bookStore.scrollTo,
    behavior: 'instant',
  });
});
onActivated(() => {
  refScrollContainer.value?.scrollTo({
    top: bookStore.scrollTo,
    behavior: 'instant',
  });
});
</script>

<template>
  <section class="flex flex-col gap-2 p-2 bg-card w-full">
    <nav
      class="container-banner scroll-container flex gap-2 p-2 mx-auto"
      aria-label="书籍分类"
    >
      <ul class="flex gap-2">
        <li
          v-for="value in bookStore.categories"
          :key="value"
          :class="[{ 'active-common': selectedCategory === value }]"
          @click="selectedCategory = value"
          class="text-nowrap p-2 radius-sm bg-hover-secondary mouse-cursor"
        >
          {{ value }}
        </li>
      </ul>
    </nav>
    <QScrollContainer
      ref="home-container"
      scroll-y
      class="scroll-container grid gap-6 p-6 home-container"
      style="height: calc(100vh - 6rem)"
      @ended="bookStore.addBookByCategory()"
      @scroll="({ y }: { y: number }) => bookStore.setScrollTo(y)"
    >
      <BookItem
        v-for="book in bookStore.getCategoryBook"
        :key="book.id"
        :book="book"
        :width="width"
        :height="height"
      />
      <BookItemSkeleton
        v-show="bookStore.$state.loading"
        v-for="(_, index) in 25"
        :key="index"
        :width="width"
        :height="height"
      />
    </QScrollContainer>
  </section>
</template>
<style lang="css" scoped>
.home-container {
  grid-template-columns: repeat(auto-fit, 350px);
  grid-auto-rows: 120px;
  justify-content: center;
  border-top: 1px solid var(--primary-color);
}
</style>
