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
  <article
    class="flex gap-2 items-center mouse-cursor"
    @click="() => router.push(`/book-detail/${book.id}`)"
  >
    <QLazyImage :src="book.cover" :height="height" :width="width" />
    <div class="flex-1 flex flex-col gap-2 h-full overflow-hidden">
      <h4>{{ book.name }}</h4>
      <h6>作者: {{ book.author }}</h6>
      <p class="flex flex-col gap-2 flex-1 text-muted text-08rem text-overflow">
        {{ book.description }}
      </p>
    </div>
  </article>
</template>
