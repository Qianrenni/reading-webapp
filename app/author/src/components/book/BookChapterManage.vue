<template>
  <div class="flex flex-col gap-2 p-2 shadow-common">
    <div class="flex justify-between">
      <QFormButton type="button" class="button-delete p-2 radius-md">
        <span>批量删除</span>
      </QFormButton>
      <QFormButton
        type="button"
        class="button-outline p-2 radius-md"
        @click="handleCreateChapter()"
      >
        <span>新增章节</span>
      </QFormButton>
    </div>
    <div v-show="loading" style="height: calc(100vh - 12.5rem)">
      <QLoading type="skeleton" class="flex-1" />
    </div>
    <QFormTable
      v-show="!loading"
      style="height: calc(100vh - 12.5rem)"
      :columns="columns"
      :data="catalogList"
      selectable
      size="small"
      class="text-one-line"
    >
      <template #index="{ row }">
        <span>第{{ (row.index as number) + 1 }}章</span>
      </template>
      <template #wordsCount="{ row }">
        <span>{{ row.wordsCount }} 字</span>
      </template>
      <template #createdAt="{ value }">
        <span>{{
          new UseTimeUtils(value as string).format('YYYY年M月D日H时')
        }}</span>
      </template>
      <template #updatedAt="{ value }">
        <span>{{
          new UseTimeUtils(value as string).format('YYYY年M月D日H时')
        }}</span>
      </template>
      <template #status="{ row }">
        <span>{{ TranslationStatus[row.status as StatusEnum] }}</span>
      </template>
      <template #dynamic="{ row }">
        <span>{{
          getLinkChildren(row.id as number).length > 1 ? '更新中' : ''
        }}</span>
      </template>
      <template #action="{ row }">
        <div class="flex gap-2 items-center">
          <QIcon
            icon="Edit"
            size="16px"
            title="编辑"
            class="hover-color-primary"
            @click="
              router.push({
                name: 'BookEdit',
                query: {
                  bookId: props.bookId,
                  chapterId: getLinkChildren(row.id as number),
                },
              })
            "
          />
          <QIcon icon="Trash" size="16px" title="删除" />
        </div>
      </template>
    </QFormTable>
  </div>
</template>
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import {
  TranslationStatus,
  type BookChapter,
  type StatusEnum,
} from '@guga-reading/types';
import { useApiAuthor } from '@guga-reading/shares';
import type { TableColumn } from 'qyani-components';
import {
  QFormTable,
  QIcon,
  QFormButton,
  QLoading,
  useMessage,
} from 'qyani-components';
import { UseTimeUtils, binarySearchLeft } from '@qianrenni/core';
import { router } from '@/route';
defineOptions({
  name: 'BookChapterManage',
});
const props = defineProps<{
  bookId: number;
}>();
const catalogList = ref<BookChapter[]>([]);
const loading = ref(false);
const columns = [
  {
    label: '序号',
    value: 'index',
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
    label: '发布时间',
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
    label: '动态',
    value: 'dynamic',
  },
  {
    label: '操作',
    value: 'action',
  },
] satisfies TableColumn[];
const update = new Map<number, number>();
const handleCreateChapter = () => {
  useApiAuthor
    .updateBookChapter(
      props.bookId,
      '新建章节(未命名)',
      '待写......',
      (catalogList.value[catalogList.value.length - 1]?.order ?? 0) + 2.0,
    )
    .then((res) => {
      if (res.success) {
        useMessage.success('新增章节成功');
        run();
      } else {
        useMessage.error(`新增章节失败-${res.message}`);
      }
    });
};
const getLinkChildren = (parentId: number) => {
  const res = [parentId];
  if (update.has(parentId)) {
    res.push(update.get(parentId)!);
  }
  return res;
};
const run = async () => {
  loading.value = true;
  useApiAuthor
    .getBookChapter(props.bookId)
    .then((res) => {
      const tempUpdate = [];
      let temp = [];
      for (const item of res.data) {
        if (item.order >= 0) {
          temp.push(item);
        } else if (item.status !== 'PUBLISHED') {
          tempUpdate.push(item);
        }
      }
      temp = temp.sort((a, b) => a.order - b.order);
      for (const item of tempUpdate) {
        item.order = Math.abs(item.order);
        const index = binarySearchLeft<BookChapter>(
          temp,
          item,
          (a, b) => a.order - b.order,
        );
        update.set(temp[index]!.id, item.id);
        item.order = -item.order;
      }
      catalogList.value = temp.map((item, index) => ({
        ...item,
        index,
      }));
    })
    .finally(() => {
      loading.value = false;
    });
};

onBeforeMount(() => {
  run();
});
</script>
