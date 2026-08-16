import { describe, it, expect } from 'vitest';
import { getHeatMapOptions, buildHeatMapData } from '../composable';

describe('getHeatMapOptions', () => {
  it('空数据返回空对象', () => {
    expect(getHeatMapOptions([], ['高', '低'], 2024, '标题')).toEqual({});
  });

  it('生成日历热力图配置', () => {
    const options = getHeatMapOptions(
      [['2024-01-01', 5]],
      ['高/分钟数', '低'],
      2024,
      '年阅读量热力图',
      0,
      10,
    );

    const anyOptions = options as Record<string, unknown>;
    expect(anyOptions['calendar']).toMatchObject({ range: '2024' });
    expect(anyOptions['visualMap']).toMatchObject({ min: 0, max: 10 });
    expect(anyOptions['title']).toMatchObject({ text: '年阅读量热力图' });
    expect(anyOptions['series']).toMatchObject({
      type: 'heatmap',
      coordinateSystem: 'calendar',
    });
  });

  it('自定义 min/max 生效', () => {
    const options = getHeatMapOptions(
      [['2024-01-01', 5]],
      ['高/pv', '低'],
      2024,
      'pv',
      0,
      15,
    );
    expect((options as Record<string, unknown>)['visualMap']).toMatchObject({
      min: 0,
      max: 15,
    });
  });
});

describe('buildHeatMapData', () => {
  it('空数据返回空结果', () => {
    const result = buildHeatMapData([]);
    expect(result.yearHeatMap).toEqual({});
    expect(result.pvHeatMap).toEqual({});
    expect(result.hours).toEqual([]);
    expect(result.firstYear).toBeNull();
  });

  it('按年聚合时长（秒→分钟）与 PV，并补齐全年', () => {
    // 2024-01-01 00:00 总时长 120 秒 → 2 分钟；PV 3
    const result = buildHeatMapData([
      {
        hourStart: '2024-01-01T00:00:00',
        totalDuration: 120,
        pageViewCount: 3,
      } as never,
    ]);

    expect(result.firstYear).toBe('2024');
    expect(result.yearHeatMap['2024']).toHaveLength(366); // 2024 闰年
    const day1 = result.yearHeatMap['2024']![0]!;
    expect(day1[0]).toBe('2024-01-01');
    expect(day1[1]).toBe(2); // 120 秒 / 60 = 2 分钟

    expect(result.pvHeatMap['2024']![0]![1]).toBe(3);
    // 小时维度：[星期, 小时, PV]
    expect(result.hours).toContainEqual([1, 0, 3]);
  });

  it('同日多次统计累加', () => {
    const result = buildHeatMapData([
      {
        hourStart: '2024-01-01T00:00:00',
        totalDuration: 60,
        pageViewCount: 1,
      } as never,
      {
        hourStart: '2024-01-01T00:00:00',
        totalDuration: 60,
        pageViewCount: 2,
      } as never,
    ]);

    expect(result.yearHeatMap['2024']![0]![1]).toBe(2); // (60+60)/60
    expect(result.pvHeatMap['2024']![0]![1]).toBe(3);
  });
});
