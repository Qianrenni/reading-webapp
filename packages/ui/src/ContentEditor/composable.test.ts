// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { textToParagraphs, paragraphsToText } from './composable';

describe('textToParagraphs', () => {
  it('空输入返回空段落', () => {
    expect(textToParagraphs('')).toBe('<p><br></p>');
    expect(textToParagraphs('   ')).toBe('<p><br></p>');
    expect(textToParagraphs(undefined as never)).toBe('<p><br></p>');
  });

  it('按换行拆分并包裹段落', () => {
    expect(textToParagraphs('第一段\n第二段')).toBe(
      '<p>第一段</p><p>第二段</p>',
    );
  });

  it('去除空行与首尾空白', () => {
    expect(textToParagraphs('  a  \n\n  b  ')).toBe('<p>a</p><p>b</p>');
  });
});

describe('paragraphsToText', () => {
  it('取所有 p 的内容并用换行连接', () => {
    expect(paragraphsToText('<p>第一段</p><p>第二段</p>')).toBe(
      '第一段\n第二段',
    );
  });

  it('无 p 标签时返回空字符串', () => {
    expect(paragraphsToText('<div>abc</div>')).toBe('');
  });

  it('空输入返回空字符串', () => {
    expect(paragraphsToText('')).toBe('');
  });
});
