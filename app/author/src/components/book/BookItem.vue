<template>
  <div class="container-column bg-card shadow-common">
    <div class="inner-container">
      <QLazyImage :src="book.cover" :height="80" :width="64" />
      <div class="inner-container-column container-flex-1">
        <h4 :title="book.name">
          {{
            book.name.length > 12
              ? book.name.substring(0, 12) + '...'
              : book.name
          }}
        </h4>
        <p class="container-space-between">
          <span class="litte-tag">{{
            book.isEnded ? '已完结' : '连载中'
          }}</span>
          <span class="text-muted text-08rem">{{ book.totalChapter }}章</span>
        </p>
      </div>
    </div>
    <p class="book-item-description text-description text-two-line">
      {{ book.description }}
    </p>
    <div class="container-space-between">
      <div
        class="container-align-center gap-fourth mouse-cursor text-primary"
        @click="
          router.push({
            name: 'BookInfoEdit',
            query: {
              id: book.id,
            },
          })
        "
      >
        <QIcon icon="Edit" size="16px" />
        <span class="text-08rem">编辑</span>
      </div>
      <div
        class="container-align-center gap-fourth mouse-cursor"
        @click="
          router.push({
            name: 'BookDetail',
            params: {
              id: book.id,
            },
          })
        "
      >
        <QIcon icon="EyeOpen" size="16px" />
        <span class="text-08rem text-muted">查看</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import type { Book } from '@guga-reading/types';
import { QLazyImage, QIcon } from 'qyani-components';
import { router } from '@/route';
defineOptions({
  name: 'BookItem',
});
defineProps<{
  book: Book;
}>();
</script>
<style scoped></style>
