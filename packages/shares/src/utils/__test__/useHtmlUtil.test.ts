// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { isHtml, applySpacingToHtml } from '../useHtmlUtil';

describe('isHtml', () => {
  it('识别 HTML 片段', () => {
    expect(isHtml('<p>你好</p>')).toBe(true);
    expect(isHtml('<img src="x.png">')).toBe(true);
    expect(isHtml('<div>abc</div>')).toBe(true);
    expect(isHtml('<br>')).toBe(true);
  });

  it('纯文本不是 HTML', () => {
    expect(isHtml('')).toBe(false);
    expect(isHtml('   ')).toBe(false);
    expect(isHtml('hello world')).toBe(false);
    expect(isHtml('1 < 2')).toBe(false);
  });
});

describe('applySpacingToHtml', () => {
  it('空输入原样返回', () => {
    expect(applySpacingToHtml('')).toBe('');
    expect(applySpacingToHtml('   ')).toBe('   ');
  });

  it('生成完整 HTML 文档并注入图片自适应样式', () => {
    const result = applySpacingToHtml('<p>正文内容</p>');
    expect(result).toContain('<!DOCTYPE html>');
    expect(result).toContain('<meta charset="UTF-8">');
    expect(result).toContain('max-width: 100%');
    expect(result).toContain('<p>正文内容</p>');
    expect(result).toContain('lang="zh-CN"');
  });

  it('保留 head 中的已有内容', () => {
    const result = applySpacingToHtml(
      '<head><meta name="description" content="desc"></head><body><p>x</p></body>',
    );
    expect(result).toContain('content="desc"');
    expect(result).toContain('<p>x</p>');
  });
});
