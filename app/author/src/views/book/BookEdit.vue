<template>
  <div class="flex flex-col gap-2 w-full">
    <div class="flex justify-between">
      <BackButton>
        <span class="hidden-768">退出编辑</span>
      </BackButton>
      <div class="flex gap-2 items-center">
        <div>
          <QFormSelect
            placeholder="选择章节"
            :options="options"
            v-model="currentIndex"
            style="width: 15rem"
          />
        </div>
        <QIcon icon="Save" size="16px" title="保存" @click="saveChapter" />
      </div>
    </div>
    <EditableTitle v-model="title" />
    <ContentEditor
      v-model="content"
      class="flex-1"
      :content-height="'calc( 100vh - 15rem )'"
    />
  </div>
</template>
<script lang="ts" setup>
import {
  computed,
  ref,
  watch,
  onBeforeMount,
  onMounted,
  onUnmounted,
} from 'vue';
import { router } from '@/route';
import { ContentEditor } from '@guga-reading/ui';
import { BackButton } from '@/components/common/BackButton';
import {
  QIcon,
  QFormSelect,
  useMessage,
  useShowLoading,
} from 'qyani-components';
import { UseTimeUtils } from '@qianrenni/core';
import { useApiAuthor } from '@guga-reading/shares';
import { TranslationStatus, type BookChapter } from '@guga-reading/types';
import { EditableTitle } from '@guga-reading/ui';
const bookId = parseInt(router.currentRoute.value.query.bookId as string);
const chapterIds = Array.isArray(router.currentRoute.value.query.chapterId)
  ? router.currentRoute.value.query.chapterId.map((id) =>
      parseInt(id as string),
    )
  : [parseInt(router.currentRoute.value.query.chapterId as string)];
const bookChapters = ref<BookChapter[]>([]);
const chapterContents = ref<string[]>([]);
const currentIndex = ref<string>('-1');
const content = ref<string>('');
const title = ref<string>('');
const options = computed(() => {
  return bookChapters.value.map((chapter, index) => ({
    label: `${chapter.title}-${TranslationStatus[chapter.status]}-${new UseTimeUtils(chapter.createdAt).format('M月D日H时m分')}`,
    value: String(index),
  }));
});
watch(
  () => currentIndex.value,
  () => {
    const index = parseInt(currentIndex.value);
    content.value = chapterContents.value[index] || '';
    title.value = bookChapters.value[index]?.title || '';
  },
);
const saveChapter = () => {
  useShowLoading.show();
  const item = bookChapters.value[parseInt(currentIndex.value)]!;
  useApiAuthor
    .updateBookChapter(
      bookId,
      title.value || '',
      content.value || '',
      item.status == 'PUBLISHED' ? -Math.abs(item.order) : item.order,
    )
    .then((res) => {
      if (res.success) {
        useMessage.success('保存成功');
      } else {
        useMessage.error(`${res.message || '保存失败'}`);
      }
    })
    .finally(() => {
      useShowLoading.hide();
    });
};
const handleKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 's') {
    e.preventDefault();
    saveChapter();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});

onBeforeMount(() => {
  useShowLoading.show();
  Promise.all([
    useApiAuthor.getBookChapter(bookId, chapterIds).then((res) => {
      if (res.success) {
        bookChapters.value = res.data;
      }
    }),
    useApiAuthor.getBookChapterContent(bookId, chapterIds).then((res) => {
      if (res.success) {
        chapterContents.value = res.data;
      }
    }),
  ])
    .then(() => {
      currentIndex.value = String(bookChapters.value.length - 1);
    })
    .finally(() => {
      useShowLoading.hide();
    });
});
</script>
<style scoped></style>
