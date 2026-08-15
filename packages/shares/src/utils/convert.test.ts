// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { formatBytes, transformImage } from './convert';

describe('formatBytes', () => {
  it('空值/非正值返回 0 B', () => {
    expect(formatBytes(undefined)).toBe('0 B');
    expect(formatBytes(null)).toBe('0 B');
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(-1)).toBe('0 B');
  });

  it('按 1024 进制格式化', () => {
    expect(formatBytes(1)).toBe('1.0 B');
    expect(formatBytes(1023)).toBe('1023.0 B');
    expect(formatBytes(1024)).toBe('1.0 KB');
    expect(formatBytes(5 * 1024)).toBe('5.0 KB');
    expect(formatBytes(3 * 1024 * 1024)).toBe('3.0 MB');
    expect(formatBytes(1073741824)).toBe('1.0 GB');
    expect(formatBytes(2 * 1024 * 1024 * 1024)).toBe('2.0 GB');
  });
});

describe('transformImage', () => {
  it('非图片文件拒绝并抛出错误', async () => {
    const textFile = new File(['hello'], 'a.txt', { type: 'text/plain' });
    await expect(transformImage(textFile, 'webp')).rejects.toThrow(
      '文件不是图片类型',
    );
  });
});
