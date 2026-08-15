<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { Book } from '@guga-reading/types';
import { QLazyImage } from 'qyani-components';
defineOptions({
  name: 'BookItem',
});
withDefaults(
  defineProps<{
    book: Book;
    width: number;
    height: number;
  }>(),
  {},
);
const router = useRouter();
</script>

<template>
  <div
    class="inner-container mouse-cursor"
    @click="() => router.push(`/book-detail/${book.id}`)"
  >
    <QLazyImage :src="book.cover" :height="height" :width="width" />
    <div
      class="container-flex-1 inner-container-column container-h100 overflow-hidden"
    >
      <h4>{{ book.name }}</h4>
      <h6>作者: {{ book.author }}</h6>
      <p
        class="inner-container-column container-flex-1 text-muted text-08rem text-overflow"
      >
        {{ book.description }}
      </p>
    </div>
  </div>
</template>
