import { describe, it, expect } from 'vitest';
import { parseBookId } from '../composable';

describe('parseBookId', () => {
  it('字符串数字', () => {
    expect(parseBookId('42')).toBe(42);
  });

  it('非数字字符串返回 null', () => {
    expect(parseBookId('abc')).toBeNull();
  });

  it('字符串数组取首项', () => {
    expect(parseBookId(['42'])).toBe(42);
    expect(parseBookId(['42', '43'])).toBe(42);
  });

  it('数组首项非字符串返回 null', () => {
    expect(parseBookId([42])).toBeNull();
    expect(parseBookId([])).toBeNull();
  });

  it('数字原样返回', () => {
    expect(parseBookId(7)).toBe(7);
  });

  it('其他类型返回 null', () => {
    expect(parseBookId(undefined)).toBeNull();
    expect(parseBookId(null)).toBeNull();
    expect(parseBookId({})).toBeNull();
  });
});
