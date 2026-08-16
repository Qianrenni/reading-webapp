// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { parseTxtContent, parseTxtFile } from '../txtParser';

describe('parseTxtContent', () => {
  it('空内容返回空描述与空章节', () => {
    expect(parseTxtContent('')).toEqual({ description: '', chapters: [] });
  });

  it('无章节标题时整本作为第一章', () => {
    const result = parseTxtContent('这是没有任何标题的正文内容。');
    expect(result.description).toBe('');
    expect(result.chapters).toHaveLength(1);
    expect(result.chapters[0].title).toBe('第一章');
    expect(result.chapters[0].wordCount).toBe(
      '这是没有任何标题的正文内容。'.length,
    );
  });

  it('按“第X章”拆分章节，首个标题前为描述', () => {
    const content = [
      '这是一段书籍描述。',
      '',
      '第一章 序章',
      '序章正文',
      '第二章 开始',
      '这是第二章正文第一行',
      '这是第二章正文第二行',
    ].join('\n');

    const result = parseTxtContent(content);
    expect(result.description).toBe('这是一段书籍描述。');
    expect(result.chapters).toHaveLength(2);
    // 标题 = 剥离“第X章”前缀后的部分
    expect(result.chapters[0]).toEqual({
      title: '序章',
      content: '序章正文',
      wordCount: 4,
    });
    expect(result.chapters[1].title).toBe('开始');
    expect(result.chapters[1].content).toBe(
      '这是第二章正文第一行\n这是第二章正文第二行',
    );
    expect(result.chapters[1].wordCount).toBe(
      '这是第二章正文第一行\n这是第二章正文第二行'.length,
    );
  });

  it('裸“第X章”（无标题）保留原标题', () => {
    const result = parseTxtContent('第一章\n正文');
    expect(result.chapters[0].title).toBe('第一章');
    expect(result.chapters[0].content).toBe('正文');
  });

  it('正文行以“第X章”开头（无空格）也会被当作章节标题', () => {
    const result = parseTxtContent('第二章正文内容\n后续');
    expect(result.chapters[0].title).toBe('正文内容');
    expect(result.chapters[0].content).toBe('后续');
  });

  it('支持 Markdown “# 标题”', () => {
    const content = '# 第一章 标题\n内容'.trim();
    const result = parseTxtContent(content);
    expect(result.chapters[0].title).toBe('第一章 标题');
    expect(result.chapters[0].content).toBe('内容');
  });

  it('支持“第X节 标题”', () => {
    const result = parseTxtContent('第一节 开始\n这是第一节内容');
    expect(result.chapters[0].title).toBe('开始');
    expect(result.chapters[0].content).toBe('这是第一节内容');
  });

  it('章节标题行本身不参与内容', () => {
    const result = parseTxtContent('第一章 序章\n内容');
    expect(result.chapters[0].content).toBe('内容');
    expect(result.chapters[0].wordCount).toBe(2);
  });

  it('无正文的章节 wordCount 为 0', () => {
    const result = parseTxtContent('第一章 序章\n第二章 尾声');
    expect(result.chapters[0].content).toBe('');
    expect(result.chapters[0].wordCount).toBe(0);
    expect(result.chapters[1].title).toBe('尾声');
  });
});

describe('parseTxtFile', () => {
  it('从 UTF-8 File 读取并解析', async () => {
    const file = new File(['描述\n第一章 开始\n这是正文'], 'book.txt', {
      type: 'text/plain',
    });
    const result = await parseTxtFile(file);
    expect(result.description).toBe('描述');
    expect(result.chapters).toHaveLength(1);
    expect(result.chapters[0].title).toBe('开始');
    expect(result.chapters[0].content).toBe('这是正文');
  });

  it('无章节标题时整本作为第一章', async () => {
    const file = new File(['只有正文没有标题'], 'book.txt', {
      type: 'text/plain',
    });
    const result = await parseTxtFile(file);
    expect(result.chapters).toHaveLength(1);
    expect(result.chapters[0].title).toBe('第一章');
    expect(result.chapters[0].content).toBe('只有正文没有标题');
  });
});
