<template>
  <div class="flex flex-col gap-2 w-full">
    <QTab
      :list="tabs.map((item) => item.name)"
      @select="(index) => (selectedIndex = index)"
    />
    <component :is="tabs[selectedIndex]?.component" />
  </div>
</template>
<script lang="ts" setup>
import { defineAsyncComponent, ref } from 'vue';
import { QTab } from 'qyani-components';
defineOptions({
  name: 'DraftManage',
});
const selectedIndex = ref(0);
const tabs = [
  {
    name: '书籍章节变动',
    component: defineAsyncComponent(
      () => import('@/components/book/BookChapterDraftManage'),
    ),
  },
  {
    name: '书籍变动',
    component: defineAsyncComponent(
      () => import('@/components/book/BookDraftManage'),
    ),
  },
];
</script>
