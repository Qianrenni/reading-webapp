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
import BookItem from '@/components/BookItem.vue';
import { QScrollContainer, QSkeleton } from 'qyani-components';

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
      selectedCategory.value = bookStore.categories[0];
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
  <div class="container-column bg-card container-w100">
    <div class="container-banner scroll-container container margin-auto">
      <span
        v-for="value in bookStore.categories"
        :key="value"
        :class="[{ 'active-common': selectedCategory === value }]"
        @click="selectedCategory = value"
        class="text-nowrap padding-fourth-rem radius-third-rem bg-hover-secondary mouse-cursor"
      >
        {{ value }}
      </span>
    </div>
    <QScrollContainer
      ref="home-container"
      scroll-y
      class="scroll-container home-container"
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
      <QSkeleton v-show="bookStore.$state.loading" v-for="_ in 25" />
    </QScrollContainer>
  </div>
</template>
<style lang="css" scoped>
.home-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, 350px);
  grid-auto-rows: 120px;
  gap: 1rem;
  padding: 1rem;
  border-top: 1px solid var(--primary-color);
}
</style>
