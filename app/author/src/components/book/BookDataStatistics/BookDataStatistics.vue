<template>
  <div class="chart-container scroll-container bg-card shadow-common">
    <div class="flex flex-col gap-2">
      <QFormSelect
        placeholder="选择年份"
        :options="selectOptions"
        v-model="selectValue"
      />
      <HeatMapChart
        :option="heatMapOptions"
        class="w-full"
        style="height: 250px"
      />
      <HeatMapChart
        :option="pvHeatMapOptions"
        class="w-full"
        style="height: 250px"
      />
    </div>
    <div class="flex flex-col gap-2" style="height: 580px">
      <HeatMapChart :option="hourOptions" class="w-full h-full" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue';
import type { ChapterReadStatistic } from '@guga-reading/types';
import { useApiStatistic } from '@guga-reading/shares';
import { type ECOption } from '@/components/chart/composable';
import { HeatMapChart } from '@/components/chart/HeatMapChart';
import { QFormSelect } from 'qyani-components';
import { getHeatMapOptions, buildHeatMapData } from './composable';
defineOptions({
  name: 'BookDataStatistics',
});
const props = defineProps<{
  bookId: number;
}>();
const rawData = ref<ChapterReadStatistic[]>([]);
const yearHeatMap = ref<Record<string, [string, number][]>>({});
const pvHeatMap = ref<Record<string, [string, number][]>>({});
const hours = ref<[number, number, number][]>([]);
const selectOptions = computed(() => {
  return Object.keys(yearHeatMap.value).map((year) => {
    return {
      label: `${year}年数据`,
      value: year,
    };
  });
});
const selectValue = ref<string | null>(null);
const heatMapOptions = computed(() => {
  return getHeatMapOptions(
    selectValue.value != null ? yearHeatMap.value[selectValue.value]! : [],
    ['高/分钟数', '低'],
    parseInt(selectValue.value || '0', 10),
    '年阅读量热力图',
  );
});
const pvHeatMapOptions = computed(() => {
  return getHeatMapOptions(
    selectValue.value != null ? pvHeatMap.value[selectValue.value]! : [],
    ['高/pv', '低'],
    parseInt(selectValue.value || '0', 10),
    '年pv热力图',
    0,
    15,
  );
});
const hourOptions = computed(() => {
  if (hours.value.length <= 0) {
    return {} as ECOption;
  }
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    title: {
      text: '小时阅读量热力图',
      left: 'center',
      top: 5,
      textStyle: {
        fontSize: 16,
      },
    },
    xAxis: {
      name: '星期',
      type: 'category',
      data: ['日', '一', '二', '三', '四', '五', '六'],
    },
    yAxis: {
      name: '小时',
      type: 'category',
      data: Array.from({ length: 24 }, (_, i) => i),
    },
    visualMap: {
      min: 0,
      max: 60,
      orient: 'horizontal',
      left: 'center',
      top: 20,
      inRange: {
        color: [
          '#ffffbf',
          '#fee090',
          '#fdae61',
          '#f46d43',
          '#d73027',
          '#a50026',
        ],
      },
      text: ['高/PV', '低'],
    },
    series: {
      type: 'heatmap',
      data: hours.value,
    },
  } as ECOption;
});
const processHeatMapData = (data: ChapterReadStatistic[]) => {
  const result = buildHeatMapData(data);
  yearHeatMap.value = result.yearHeatMap;
  pvHeatMap.value = result.pvHeatMap;
  hours.value = result.hours;
  selectValue.value = result.firstYear;
};
onBeforeMount(() => {
  useApiStatistic.getBookStatistics(props.bookId).then((res) => {
    rawData.value = res.data || ([] as ChapterReadStatistic[]);
    processHeatMapData(rawData.value);
  });
});
</script>
<style lang="css" scoped>
.chart-container {
  display: grid;
  flex: 1;
  padding: 0.5rem;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  grid-auto-rows: auto;
}
</style>
