<template>
  <div class="container-column">
    <div class="inner-container container-row-768-column">
      <div
        v-for="book in books"
        class="inner-container-column container-flex-1 padding-half-rem bg-card text-085rem"
      >
        <p v-if="isUpdate" class="text-center">
          <span class="text-12rem">{{
            book.status == 'PUBLISHED' ? '修改前' : '修改后'
          }}</span>
        </p>
        <p>
          <span class="text-12rem">书名</span
          ><span class="margin-half-horizontal">{{ book.name }}</span>
        </p>
        <p>
          <span class="text-12rem">作者</span
          ><span class="margin-half-horizontal">{{ book.author }}</span>
        </p>
        <p class="bg-secondary">
          <span class="text-12rem">简介</span
          ><span class="margin-half-horizontal">{{ book.description }}</span>
        </p>
        <div>
          <p class="text-12rem">封面</p>
          <QLazyImage :src="book.cover" alt="封面" :width="96" :height="144" />
        </div>
        <p>
          <span class="text-12rem">分类</span
          ><span class="margin-half-horizontal">{{ book.category }}</span>
        </p>
        <p>
          <span class="text-12rem">标签</span>
          <span
            class="tag margin-fourth-horizontal"
            v-for="value in book.tags?.split(/[, ]/)"
            >{{ value }}
          </span>
        </p>
      </div>
    </div>
    <div class="inner-container container-flex-end">
      <QFormButton
        @click="
          () => {
            useApiAudit.patchAuditBook(bookId, true).then((res) => {
              if (res.success) {
                useMessage.success('审批通过');
                router.replace({
                  path: '/draft-manage',
                });
              }
            });
          }
        "
        >通过</QFormButton
      >
      <QFormButton
        @click="
          () => {
            useApiAudit.patchAuditBook(bookId, false).then((res) => {
              if (res.success) {
                useMessage.success('审批驳回');
                router.replace({
                  path: '/draft-manage',
                });
              }
            });
          }
        "
        >驳回</QFormButton
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
import router from '@/route';
import { useApiAudit, useApiBooks } from '@guga-reading/shares';
import type { Book } from '@guga-reading/types';
import { onBeforeMount, ref } from 'vue';
import { QLazyImage, QFormButton, useMessage } from 'qyani-components';
const bookId = parseInt(router.currentRoute.value.query.bookId as string);
const book = ref<Book>({} as Book);
const books = ref<Book[]>([]);
const isUpdate = ref(bookId < 0);
onBeforeMount(() => {
  useApiAudit.getAuditBook([bookId]).then((res) => {
    book.value = res.data[0] as Book;
    books.value = [book.value, ...books.value];
    if (isUpdate.value) {
      useApiBooks.getBookById(-bookId).then((res) => {
        books.value = [res.data, ...books.value];
      });
    }
  });
});
</script>
