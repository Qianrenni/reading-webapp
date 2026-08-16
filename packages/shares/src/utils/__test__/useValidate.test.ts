import { describe, it, expect } from 'vitest';
import { useValidate } from '../useValidate';

describe('useValidate.email', () => {
  it('常见邮箱后缀校验通过', () => {
    expect(useValidate.email('test@qq.com')).toBe(true);
    expect(useValidate.email('test@163.com')).toBe(true);
    expect(useValidate.email('test@126.com')).toBe(true);
    expect(useValidate.email('test@139.com')).toBe(true);
    expect(useValidate.email('test@sina.com')).toBe(true);
    expect(useValidate.email('test@yahoo.com')).toBe(true);
    expect(useValidate.email('test@outlook.com')).toBe(true);
  });

  it('合法邮箱格式但不支持后缀时返回 false', () => {
    expect(useValidate.email('test@gmail.com')).toBe(false);
    expect(useValidate.email('test@example.com')).toBe(false);
  });

  it('非法邮箱格式返回 false', () => {
    expect(useValidate.email('')).toBe(false);
    expect(useValidate.email('invalid')).toBe(false);
    expect(useValidate.email('a@b.c')).toBe(false);
    expect(useValidate.email('no-at-sign.com')).toBe(false);
    expect(useValidate.email('user@')).toBe(false);
  });

  it('邮箱大小写敏感：大写后缀不被识别', () => {
    expect(useValidate.email('test@QQ.com')).toBe(false);
  });
});
