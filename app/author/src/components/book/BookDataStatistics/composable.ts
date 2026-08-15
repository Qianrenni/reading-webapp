import type { ChapterReadStatistic } from '@guga-reading/types';
import { UseTimeUtils } from '@qianrenni/core';
import type { ECOption } from '@/components/chart/composable';

/**
 * BookDataStatistics 数据聚合纯函数
 * 从 BookDataStatistics.vue 中解耦，便于单元测试。
 */

/** 按年热力图数据聚合结果 */
export interface HeatMapResult {
  /** 年 → [日期, 分钟数] */
  yearHeatMap: Record<string, [string, number][]>;
  /** 年 → [日期, PV] */
  pvHeatMap: Record<string, [string, number][]>;
  /** [星期, 小时, PV] */
  hours: [number, number, number][];
  /** 首个有数据的年份（用于默认选中） */
  firstYear: string | null;
}

/**
 * 生成日历热力图 ECharts 配置
 * 空数据返回空对象。
 */
export function getHeatMapOptions(
  data: [string, number][],
  visualMapText: [string, string],
  year: number,
  title: string,
  min: number = 0,
  max: number = 10,
): ECOption {
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

/**
 * 将原始阅读统计聚合为按年/按小时的热力图数据（纯函数，不依赖组件状态）。
 */
export function buildHeatMapData(data: ChapterReadStatistic[]): HeatMapResult {
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
  const yearHeatMap = {} as Record<string, [string, number][]>;
  const pvHeatMap = {} as Record<string, [string, number][]>;
  for (const year of years) {
    const durationData = [] as [string, number][];
    const pvData = [] as [string, number][];
    const start = new UseTimeUtils(`${year}-01-01`);
    const end = new UseTimeUtils(`${year + 1}-01-01`);
    while (!start.equals(end)) {
      const current = start.format('YYYY-MM-DD');
      durationData.push([
        current,
        parseFloat(((yearDict[year]!.get(current) || 0) / 60.0).toFixed(2)),
      ]);
      pvData.push([current, pvDict[year]!.get(current) || 0]);
      start.add(1, 'day');
    }
    yearHeatMap[year] = durationData;
    pvHeatMap[year] = pvData;
  }

  const hours = Object.keys(hoursData).map((hourWeek) => {
    const [week, hour] = hourWeek.split('/');
    return [parseInt(week!), parseInt(hour!), hoursData[hourWeek]!] as [
      number,
      number,
      number,
    ];
  });

  return {
    yearHeatMap,
    pvHeatMap,
    hours,
    firstYear: years.length > 0 ? String(years[0]!) : null,
  };
}
