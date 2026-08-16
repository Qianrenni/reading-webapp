<template>
  <section class="flex flex-col gap-2 p-2 flex-wrap">
    <QFormTable :columns="columns" :data="books" size="small">
      <template #status="{ row }">
        {{ TranslationStatus[row.status as StatusEnum] }}
      </template>
      <template #type="{ row }">
        {{ (row.id as number) < 0 ? '更新' : '创建' }}
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
        <div class="flex gap-2 items-center">
          <QIcon
            icon="EyeOpen"
            size="16px"
            title="查看"
            class="hover-color-primary"
            @click="
              () => {
                router.push({
                  path: `/book-audit`,
                  query: {
                    bookId: row.id as number,
                  },
                });
              }
            "
          />
        </div>
      </template>
    </QFormTable>
  </section>
</template>
<script lang="ts" setup>
import router from '@/route';
import { TranslationStatus, type StatusEnum } from '@guga-reading/types';
import { QFormTable, type TableColumn, QIcon } from 'qyani-components';
import { UseTimeUtils } from '@qianrenni/core';
import { useDraftBookList } from './composable';
const { books } = useDraftBookList();
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
</script>
<style lang="css" scoped></style>
