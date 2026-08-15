<template>
  <div
    class="flex items-center gap-2 mouse-cursor hover-color-primary"
    @click="router.back()"
  >
    <QIcon icon="Left" size="18px" />
    <slot>
      <span>返回</span>
    </slot>
  </div>
</template>
<script lang="ts" setup>
import { QIcon } from 'qyani-components';
import { useRouter } from 'vue-router';
const router = useRouter();
</script>
<style scoped></style>
