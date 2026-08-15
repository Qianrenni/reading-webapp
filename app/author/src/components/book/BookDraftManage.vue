<template>
  <div class="container-column bg-card shadow-common">
    <div v-show="loading" style="height: calc(100vh - 8rem)">
      <QLoading type="skeleton" />
    </div>
    <QFormTable
      v-show="!loading"
      :columns="columns"
      :data="bookDrafts"
      size="small"
      class="text-one-line"
      style="height: calc(100vh - 9rem)"
    >
      <template #name="{ row }">
        <span>{{ row.name }}</span>
      </template>
      <template #status="{ row }">
        {{ TranslationStatus[row.status as StatusEnum] }}
      </template>
      <template #action="{ row }">
        {{ (row.id as number) > 0 ? '创建' : '更新' }}
      </template>
      <template #cover="{ row }">
        <QLazyImage :src="row.cover as string" :height="128" :width="72" />
      </template>
      <template #description="{ row }">
        <p class="scroll-container book-description">
          {{ row.description }}
        </p>
      </template>
      <template #tags="{ row }">
        <div class="inner-container container-wrap gap-half">
          <span
            v-for="tag in (row.tags as string).split(' ')"
            :key="tag"
            class="tag"
            style="text-wrap-mode: nowrap"
          >
            {{ tag }}
          </span>
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
                  name: 'BookInfoEdit',
                  query: {
                    id: row.id as number,
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
                useApiAuthor.updateStatusBook(row.id as number).then((res) => {
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
            @click="cancelChange(row as unknown as Book)"
          />
        </div>
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
  useMessage,
  QLazyImage,
  QLoading,
} from 'qyani-components';
import { UseTimeUtils } from '@qianrenni/core';
import { useApiAuthor } from '@guga-reading/shares';
import { onBeforeMount, ref } from 'vue';
import {
  TranslationStatus,
  type Book,
  type StatusEnum,
} from '@guga-reading/types';
import { router } from '@/route';
const loading = ref(false);
const bookDrafts = ref<Book[]>([]);
const columns = [
  {
    value: 'name',
    label: '书名',
  },
  {
    value: 'cover',
    label: '封面',
  },
  {
    value: 'description',
    label: '简介',
  },
  {
    value: 'category',
    label: '分类',
  },
  {
    value: 'tags',
    label: '标签',
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
const cancelChange = (book: Book) => {
  useApiAuthor.deleteBook(book.id).then((res) => {
    if (res.success) {
      useMessage.success('撤销成功');
      refresh();
    } else {
      useMessage.error(res.message || '撤销失败');
    }
  });
};
const refresh = () => {
  loading.value = true;
  useApiAuthor
    .getBook()
    .then((res) => {
      const temp = [];
      for (const book of res.data) {
        if (book.status !== 'PUBLISHED') {
          temp.push(book);
        }
      }
      bookDrafts.value = temp;
    })
    .finally(() => {
      loading.value = false;
    });
};
onBeforeMount(() => {
  refresh();
});
</script>
<style lang="css" scoped>
.book-description {
  max-height: 128px;
  min-width: 10rem;
  max-width: 20rem;
  white-space: wrap;
  -webkit-line-clamp: unset;
  line-clamp: unset;
}
</style>
