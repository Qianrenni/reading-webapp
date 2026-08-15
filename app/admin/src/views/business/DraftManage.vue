<template>
  <div class="container-column container-w100">
    <QTab
      :list="tabs.map((item) => item.name)"
      @select="(index) => (selectedIndex = index)"
    />
    <RouterView />
  </div>
</template>
<script lang="ts" setup>
import { onBeforeMount, ref, watch } from 'vue';
import { QTab } from 'qyani-components';
import router from '@/route';
defineOptions({
  name: 'DraftManage',
});
const selectedIndex = ref(0);
const tabs = [
  {
    name: '章节变动',
    pathName: 'DraftManageChapter',
  },
  {
    name: '书籍变动',
    pathName: 'DraftManageBook',
  },
];
watch(
  () => selectedIndex.value,
  () => {
    router.replace({
      name: tabs[selectedIndex.value]?.pathName,
    });
  },
);
onBeforeMount(() => {
  router.replace({
    name: 'DraftManageChapter',
  });
});
</script>
