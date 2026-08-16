<!-- src/components/charts/BookReadTrendChart.vue -->
<template>
  <div ref="refChart" />
</template>

<script setup lang="ts">
import { type ECOption, echarts } from '@/components/chart/composable';
import { useWindowResize } from 'qyani-components';
import { onMounted, onUnmounted, ref, watch } from 'vue';
const refChart = ref<HTMLElement | null>(null);
let chart: echarts.ECharts | null = null;
const props = defineProps<{
  option: ECOption;
}>();
watch(
  () => props.option,
  () => {
    chart?.setOption(props.option);
  },
);
const resizeHandler = () => {
  chart?.resize();
};
onMounted(() => {
  if (refChart.value) {
    chart = echarts.init(refChart.value);
    chart?.setOption(props.option);
    useWindowResize.addHandler(resizeHandler);
  }
});
onUnmounted(() => {
  if (refChart.value) {
    useWindowResize.removeHandler(resizeHandler);
    chart?.dispose();
    chart = null;
  }
});
</script>
