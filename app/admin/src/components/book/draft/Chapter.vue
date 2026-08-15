<template>
  <div class="container-column container-wrap">
    <QFormTable :columns="columns" :data="bookchapters" size="small">
      <template #name="{ row }">
        {{ bookMap[row.bookId as number]?.name || '--' }}
      </template>
      <template #author="{ row }">
        {{ bookMap[row.bookId as number]?.author || '--' }}
      </template>
      <template #status="{ row }">
        {{ TranslationStatus[row.status as StatusEnum] }}
      </template>
      <template #type="{ row }">
        {{ (row.order as number) > 0 ? '章节更新' : '章节修改' }}
      </template>
      <template #createdAt="{ row }">
        <span>
          {{
            new UseTimeUtils(row.createdAt as string).format('YYYY年M月D日H时')
          }}
        </span>
      </template>
      <template #updatedAt="{ row }">
        <span>
          {{
            new UseTimeUtils(row.updatedAt as string).format('YYYY年M月D日H时')
          }}
        </span>
      </template>
      <template #operation="{ row }">
        <div class="inner-container">
          <QIcon
            icon="EyeOpen"
            size="16px"
            title="查看"
            class="hover-color-primary"
            @click="
              () => {
                router.push({
                  path: `/chapter-audit`,
                  query: {
                    chapterId: row.id as number,
                    order: row.order as number,
                    bookId: row.bookId as number,
                  },
                });
              }
            "
          />
        </div>
      </template>
    </QFormTable>
  </div>
</template>
<script lang="ts" setup>
import router from '@/route';
import { useApiAudit } from '@guga-reading/shares';
import {
  TranslationStatus,
  type Book,
  type BookChapter,
  type StatusEnum,
} from '@guga-reading/types';
import {
  QFormTable,
  type TableColumn,
  QIcon,
  useShowLoading,
} from 'qyani-components';
import { UseTimeUtils } from '@qianrenni/core';
import { onBeforeMount, ref } from 'vue';
const bookchapters = ref<BookChapter[]>([]);
const columns: TableColumn[] = [
  {
    label: '书名',
    value: 'name',
  },
  {
    label: '作者',
    value: 'author',
  },
  {
    label: '章节名',
    value: 'title',
  },
  {
    label: '字数',
    value: 'wordsCount',
  },
  {
    label: '创建时间',
    value: 'createdAt',
  },
  {
    label: '更新时间',
    value: 'updatedAt',
  },
  {
    label: '状态',
    value: 'status',
  },
  {
    label: '类型',
    value: 'type',
  },
  {
    label: '操作',
    value: 'operation',
  },
];
const bookMap = ref<Record<number, Book>>({});
onBeforeMount(() => {
  useShowLoading.show();
  Promise.all([
    useApiAudit.getAuditBookChapter().then((res) => {
      bookchapters.value = res.data;
    }),
    useApiAudit.getAuditBook().then((res) => {
      for (const book of res.data) {
        bookMap.value[book.id] = book;
      }
    }),
  ]).finally(() => {
    useShowLoading.hide();
  });
});
</script>
<style lang="css" scoped></style>
