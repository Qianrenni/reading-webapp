<template>
  <div class="flex flex-col gap-2 w-full">
    <BackButton>
      <template #default>
        <span>返回书籍列表</span>
      </template>
    </BackButton>
    <QTab
      :list="tabs.map((item) => item.name)"
      @select="(index) => (tabIndex = index)"
    />
    <component :is="tabs[tabIndex]?.component" :book-id="bookId || 0" />
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, defineAsyncComponent } from 'vue';
import { useRoute } from 'vue-router';
import { QTab } from 'qyani-components';
import BackButton from '@/components/common/BackButton.vue';
import { parseBookId } from './composable';
defineOptions({
  name: 'BookDetail',
});

const route = useRoute();
const tabIndex = ref(0);
// 从路由参数获取书籍ID
const bookId = computed<number | null>(() => parseBookId(route.params.id));

const tabs = [
  {
    name: '章节管理',
    component: defineAsyncComponent(
      () => import('@/components/book/BookChapterManage.vue'),
    ),
  },
  {
    name: '基本信息',
    component: defineAsyncComponent(
      () => import('@/components/book/BookBasicInfo.vue'),
    ),
  },
  {
    name: '数据统计',
    component: defineAsyncComponent(
      () => import('@/components/book/BookDataStatistics'),
    ),
  },
];
</script>
