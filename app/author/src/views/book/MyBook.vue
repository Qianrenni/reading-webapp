<template>
  <div
    class="my-book-view-container scroll-container"
    style="height: calc(100vh - 3rem)"
  >
    <div class="shadow-common bg-card container-column">
      <QFormButton
        type="button"
        class="container-center button-primary container-h100"
        @click="
          router.push({
            name: 'CreateBook',
          })
        "
      >
        <div>
          <QIcon icon="Plus" size="28px" />
          <span class="text-12rem">创建新书</span>
        </div>
      </QFormButton>
    </div>
    <BookItem v-for="book in bookItems" :key="book.id" :book="book" />
    <div v-if="loading" v-for="_ in 15" style="height: 150px">
      <QLoading type="skeleton" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { onBeforeMount } from 'vue';
import { useApiAuthor } from '@guga-reading/shares';
import BookItem from '@/components/book/BookItem.vue';
import type { Book } from '@guga-reading/types';
import { QIcon, QFormButton, QLoading } from 'qyani-components';
import { router } from '@/route';
defineOptions({
  name: 'MyBookView',
});
const bookItems = ref<Book[]>([] as Book[]);
const loading = ref(false);
onBeforeMount(() => {
  loading.value = true;
  useApiAuthor
    .getBook()
    .then((res) => {
      bookItems.value.push(
        ...(res.data.filter(
          (book) => book.status === 'PUBLISHED' || book.status === 'APPROVED',
        ) ?? []),
      );
    })
    .finally(() => {
      loading.value = false;
    });
});
</script>
<style scoped></style>
