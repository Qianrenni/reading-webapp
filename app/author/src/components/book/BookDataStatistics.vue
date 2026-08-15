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
import HeatMapChart from '@/components/chart/HeatMapChart.vue';
import { QFormSelect } from 'qyani-components';
import { UseTimeUtils } from '@qianrenni/core';
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
function getHeatMapOptions(
  data: [string, number][],
  visualMapText: [string, string],
  year: number,
  title: string,
  min: number = 0,
  max: number = 10,
) {
  if (data.length <= 0) return {} as ECOption;
  return {
    title: {
      top: 5,
      left: 'center',
      text: title,
      textStyle: {
        fontSize: 16,
      },
    },
    tooltip: {},
    visualMap: {
      min,
      max,
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
      text: visualMapText,
    },
    calendar: {
      top: 95,
      left: 30,
      right: 30,
      cellSize: ['auto'],
      range: `${year}`,
      yearLabel: { show: false },
      dayLabel: { nameMap: 'ZH' },
      monthLabel: { nameMap: 'ZH' },
    },
    series: {
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: data || [],
    },
  } as ECOption;
}
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
  yearHeatMap.value = {};
  pvHeatMap.value = {};
  const yearDict = {} as Record<number, Map<string, number>>;
  const pvDict = {} as Record<number, Map<string, number>>;
  const hoursData = {} as Record<string, number>;
  for (const item of data) {
    const d = new UseTimeUtils(`${item.hourStart}`);
    const year = d.getFullYear();
    const hourWeek = `${d.getDay()}/${d.getHours()}`;
    hoursData[hourWeek] = (hoursData[hourWeek] || 0) + item.pageViewCount;
    if (!yearDict[year]) {
      yearDict[year] = new Map<string, number>();
    }
    if (!pvDict[year]) {
      pvDict[year] = new Map<string, number>();
    }
    const day = d.format('YYYY-MM-DD');
    yearDict[year].set(
      day,
      (yearDict[year].get(day) || 0) + item.totalDuration,
    );
    pvDict[year].set(day, (pvDict[year].get(day) || 0) + item.pageViewCount);
  }
  const years = Object.keys(yearDict).map((year) => parseInt(year));
  for (const year of years) {
    const data = [] as [string, number][];
    const pvData = [] as [string, number][];
    const start = new UseTimeUtils(`${year}-01-01`);
    const end = new UseTimeUtils(`${year + 1}-01-01`);
    while (!start.equals(end)) {
      const current = start.format('YYYY-MM-DD');
      data.push([
        current,
        parseFloat(((yearDict[year]!.get(current) || 0) / 60.0).toFixed(2)),
      ]);
      pvData.push([current, pvDict[year]!.get(current) || 0]);
      start.add(1, 'day');
    }
    yearHeatMap.value[year] = data;
    pvHeatMap.value[year] = pvData;
  }
  if (years.length > 0) {
    selectValue.value = String(years[0]!);
  }
  hours.value = Object.keys(hoursData).map((hourWeek) => {
    const [week, hour] = hourWeek.split('/');
    return [parseInt(week!), parseInt(hour!), hoursData[hourWeek]!];
  });
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
