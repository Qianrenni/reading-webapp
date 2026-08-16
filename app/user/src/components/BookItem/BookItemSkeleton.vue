<script lang="ts" setup>
import { QSkeleton } from 'qyani-components';
defineOptions({
  name: 'BookItemSkeleton',
});
withDefaults(
  defineProps<{
    width: number;
    height: number;
  }>(),
  {},
);
</script>

<template>
  <div class="flex gap-2 items-center">
    <div
      class="skeleton-cover"
      :style="{ width: `${width}px`, height: `${height}px` }"
    >
      <QSkeleton />
    </div>
    <div class="flex-1 flex flex-col gap-2 h-full overflow-hidden">
      <div class="skeleton-title">
        <QSkeleton />
      </div>
      <div class="skeleton-author">
        <QSkeleton />
      </div>
      <div class="skeleton-desc flex-1">
        <QSkeleton />
      </div>
    </div>
  </div>
</template>

<style scoped lang="css">
/* 与 BookItem 布局对齐：封面(左) + 书名/作者/简介(右) */
.skeleton-title {
  width: 60%;
  height: 20px;
}

.skeleton-author {
  width: 40%;
  height: 20px;
}

.skeleton-desc {
  width: 100%;
}
</style>
