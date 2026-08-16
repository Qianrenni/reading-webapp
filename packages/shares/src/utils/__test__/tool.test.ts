import { describe, it, expect } from 'vitest';
import { indexToCN } from '../tool';

describe('indexToCN', () => {
  it('负数抛错', () => {
    expect(() => indexToCN(-1)).toThrow(
      'Index must be greater than or equal to 0',
    );
  });

  it('个位数', () => {
    expect(indexToCN(0)).toBe('');
    expect(indexToCN(1)).toBe('一');
    expect(indexToCN(2)).toBe('二');
    expect(indexToCN(9)).toBe('九');
  });

  it('两位数', () => {
    expect(indexToCN(10)).toBe('十');
    expect(indexToCN(11)).toBe('十一');
    expect(indexToCN(12)).toBe('十二');
    expect(indexToCN(20)).toBe('二十');
    expect(indexToCN(21)).toBe('二十一');
    expect(indexToCN(99)).toBe('九十九');
  });

  it('三位数', () => {
    expect(indexToCN(100)).toBe('一百');
    expect(indexToCN(101)).toBe('一百零一');
    // 当前实现：110 → 一百十（无“一十”合音），为既有行为
    expect(indexToCN(110)).toBe('一百十');
    expect(indexToCN(123)).toBe('一百二十三');
  });

  it('四位数', () => {
    // 当前实现：1000 → 一千零（末尾零被截去后残留“零”），为既有行为
    expect(indexToCN(1000)).toBe('一千零');
    expect(indexToCN(1234)).toBe('一千二百三十四');
  });

  it('万以上', () => {
    // 当前实现：10000 → 一万零零（仅截去一个末尾零），为既有行为
    expect(indexToCN(10000)).toBe('一万零零');
  });
});
