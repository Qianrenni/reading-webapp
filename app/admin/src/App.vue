<script setup lang="ts">
import { RouterView } from 'vue-router';
import { HeaderNavigation } from '@guga-reading/ui';
</script>
<template>
  <div class="inner-container-column container-flex-1">
    <header-navigation avatar-url="/admin/figure.webp" />
    <router-view class="container-flex-1" />
  </div>
</template>
<style lang="css" scoped></style>
