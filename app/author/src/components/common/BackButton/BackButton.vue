<template>
  <button
    type="button"
    class="flex items-center gap-2 mouse-cursor hover-color-primary back-button"
    @click="router.back()"
  >
    <QIcon icon="Left" size="18px" />
    <slot>
      <span>返回</span>
    </slot>
  </button>
</template>
<script lang="ts" setup>
import { QIcon } from 'qyani-components';
import { useRouter } from 'vue-router';
const router = useRouter();
</script>
<style scoped>
/* 语义化按钮：去除 button UA 默认样式，视觉与原可点击 div 一致 */
.back-button {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
}
</style>
