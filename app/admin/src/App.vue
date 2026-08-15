<script setup lang="ts">
import { RouterView } from 'vue-router';
import { HeaderNavigation } from '@guga-reading/ui';
</script>
<template>
  <div class="flex flex-col gap-2 flex-1">
    <header-navigation avatar-url="/admin/figure.webp" />
    <router-view class="flex-1" />
  </div>
</template>
<style lang="css" scoped></style>
