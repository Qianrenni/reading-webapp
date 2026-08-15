<template>
  <div class="container-column bg-card shadow-common">
    <div v-show="loading" style="height: calc(100vh - 8rem)">
      <QLoading type="skeleton" />
    </div>
    <QFormTable
      v-show="!loading"
      :columns="columns"
      :data="bookChapterDrafts"
      size="small"
      class="text-one-line"
      style="height: calc(100vh - 9rem)"
    >
      <template #bookId="{ row }">
        {{ books.get(row.bookId as number)?.name }}
      </template>
      <template #status="{ row }">
        {{ TranslationStatus[row.status as StatusEnum] }}
      </template>
      <template #response="{ row }">
        <div class="inner-container">
          <QIcon
            v-if="['PENDING', 'REJECTED'].includes(row.status as string)"
            icon="Edit"
            size="16px"
            title="编辑"
            class="hover-color-primary"
            @click="
              () => {
                router.push({
                  name: 'BookEdit',
                  query: {
                    bookId: row.bookId as number,
                    chapterId: row.id as number,
                  },
                });
              }
            "
          />
          <QIcon
            icon="Upload"
            size="16px"
            title="提交审核"
            class="hover-color-primary"
            @click="
              () => {
                useApiAuthor
                  .updateStatusBookChapter(
                    row.bookId as number,
                    row.id as number,
                  )
                  .then((res) => {
                    if (res.success) {
                      useMessage.success('提交成功');
                      refresh();
                    } else {
                      useMessage.error(res.message || '提交失败');
                    }
                  });
              }
            "
          />
          <QIcon
            icon="Trash"
            size="16px"
            title="撤销改动"
            @click="
              () => {
                useApiAuthor
                  .deleteBookChapter(row.bookId as number, row.id as number)
                  .then((res) => {
                    if (res.success) {
                      useMessage.success('撤销成功');
                      refresh();
                    } else {
                      useMessage.error(res.message || '撤销失败');
                    }
                  });
              }
            "
          />
        </div>
      </template>
      <template #createdAt="{ row }">
        <span>{{
          new UseTimeUtils(row.createdAt as string).format('YYYY年M月D日H时')
        }}</span>
      </template>
      <template #updatedAt="{ row }">
        <span>{{
          new UseTimeUtils(row.updatedAt as string).format('YYYY年M月D日H时')
        }}</span>
      </template>
      <template #action="{ row }">
        <span>{{ (row.order as number) > 0 ? '创建' : '更新' }}</span>
      </template>
    </QFormTable>
  </div>
</template>
<script lang="ts" setup>
defineOptions({ name: 'BookChapterDraftManage' });
import {
  QFormTable,
  type TableColumn,
  QIcon,
  QLoading,
  useMessage,
} from 'qyani-components';
import { UseTimeUtils } from '@qianrenni/core';
import {
  TranslationStatus,
  type Book,
  type BookChapter,
  type StatusEnum,
} from '@guga-reading/types';
import { useApiAuthor } from '@guga-reading/shares';
import { onBeforeMount, ref } from 'vue';
import { router } from '@/route';
const loading = ref(false);
const bookChapterDrafts = ref<BookChapter[]>([]);
const books: Map<number, Book> = new Map();
const columns = [
  {
    value: 'bookId',
    label: '书名',
  },
  {
    value: 'title',
    label: '标题',
  },
  {
    value: 'wordsCount',
    label: '字数',
  },
  {
    value: 'createdAt',
    label: '创建时间',
  },
  {
    value: 'updatedAt',
    label: '更新时间',
  },
  {
    value: 'status',
    label: '状态',
  },
  {
    value: 'action',
    label: '类型',
  },
  {
    value: 'response',
    label: '操作',
  },
] satisfies TableColumn[];

const refresh = () => {
  loading.value = true;
  Promise.all([
    useApiAuthor.getBook().then((res) => {
      for (const book of res.data) {
        books.set(book.id, book);
      }
    }),
    useApiAuthor.getAuthorDraftChapter().then((res) => {
      bookChapterDrafts.value = res.data;
    }),
  ]).finally(() => {
    loading.value = false;
  });
};
onBeforeMount(() => {
  refresh();
});
</script>
