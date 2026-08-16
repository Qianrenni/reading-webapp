<script setup lang="ts">
import { RouterView } from 'vue-router';
import { HeaderNavigation } from '@guga-reading/ui';
</script>

<template>
  <HeaderNavigation />
  <main>
    <RouterView />
  </main>
</template>

<style scoped></style>
