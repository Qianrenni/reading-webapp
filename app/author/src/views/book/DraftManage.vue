<template>
  <div class="container-column container-w100">
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
      () => import('@/components/book/BookChapterDraftManage.vue'),
    ),
  },
  {
    name: '书籍变动',
    component: defineAsyncComponent(
      () => import('@/components/book/BookDraftManage.vue'),
    ),
  },
];
</script>
