<template>
  <span
    class="tag"
    :style="{ color: props.color, background: props.background }"
  >
    {{ props.text }}
  </span>
</template>
<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    color?: string;
    background?: string;
    text: string;
  }>(),
  {
    color: 'white',
    background: 'var(--tag-primary-color)',
  },
);
</script>
<style lang="css" scoped></style>
