/**
 * TXT 章节解析结果
 */
export interface ParsedChapter {
  title: string;
  content: string;
  wordCount: number;
}

/**
 * TXT 格式书籍章节解析结果
 */
export interface TxtParseResult {
  description: string;
  chapters: ParsedChapter[];
}

/**
 * TXT 章节解析器
 *
 * 与后端 TxtChapterParser.kt 保持完全一致的解析逻辑，支持：
 * 1. "第X章 标题" — 如 "第一章 序章"、"第100章 尾声"
 * 2. "# 标题" — Markdown 风格的一级标题
 * 3. "第X节 标题" — 如 "第一节 开始"
 *
 * 确保前后端解析结果一致性。
 */

// 第一部分："第" + 中文数字/阿拉伯数字 + "章" + 可选标题
const chapterPattern1 = /^第[一二三四五六七八九十百千万\d]+章\s*(.*)$/;

// 第二部分：# 标题
const chapterPattern2 = /^#\s+(.*)$/;

// 第三部分："第" + 中文数字/阿拉伯数字 + "节" + 可选标题
const chapterPattern3 = /^第[一二三四五六七八九十百千万\d]+节\s*(.*)$/;

/**
 * 判断一行是否为章节标题，返回解析后的章节标题文本
 */
function isChapterLine(line: string): string | null {
  const trimmed = line.trim();
  if (trimmed.length === 0) return null;

  const match1 = trimmed.match(chapterPattern1);
  if (match1) {
    return match1[1].trim() || trimmed;
  }

  const match2 = trimmed.match(chapterPattern2);
  if (match2) {
    return match2[1].trim() || trimmed;
  }

  const match3 = trimmed.match(chapterPattern3);
  if (match3) {
    return match3[1].trim() || trimmed;
  }

  return null;
}

/**
 * 解析 TXT 文件内容，返回书籍描述和章节列表
 *
 * @param content TXT 文件全部内容（字符串）
 * @returns 解析结果
 */
export function parseTxtContent(content: string): TxtParseResult {
  const lines = content.split('\n');
  const chapters: ParsedChapter[] = [];
  const beforeFirstChapter: string[] = [];

  // 第一遍：找出所有章节标题行
  const chapterLineIndices: number[] = [];
  for (let i = 0; i < lines.length; i++) {
    const title = isChapterLine(lines[i]);
    if (title !== null) {
      chapterLineIndices.push(i);
    }
  }

  if (chapterLineIndices.length === 0) {
    // 没有找到任何章节标题，整本书作为一个章节
    const body = lines.join('\n').trim();
    if (body.length > 0) {
      chapters.push({
        title: '第一章',
        content: body,
        wordCount: body.length,
      });
    }
    return { description: '', chapters };
  }

  // 第一个章节标题之前的内容作为书籍描述
  for (let i = 0; i < chapterLineIndices[0]; i++) {
    beforeFirstChapter.push(lines[i]);
  }

  // 提取每个章节
  for (let i = 0; i < chapterLineIndices.length; i++) {
    const startLine = chapterLineIndices[i];
    const endLine =
      i + 1 < chapterLineIndices.length
        ? chapterLineIndices[i + 1]
        : lines.length;
    const chapterTitle = isChapterLine(lines[startLine]) ?? `第${i + 1}章`;

    // 章节内容 = 标题行的下一行到下一个标题行之间的内容
    const contentLines =
      startLine + 1 < endLine ? lines.slice(startLine + 1, endLine) : [];
    const chapterContent = contentLines.join('\n').trim();

    chapters.push({
      title: chapterTitle,
      content: chapterContent,
      wordCount: chapterContent.length,
    });
  }

  const description = beforeFirstChapter.join('\n').trim();

  return { description, chapters };
}

/**
 * 通过尝试不同编码解码，找出最佳编码
 * 返回解码后的字符串和使用的编码
 */
function detectAndDecode(buffer: ArrayBuffer): {
  content: string;
  encoding: string;
} {
  // 1. BOM 检测（最高优先级）
  const bytes = new Uint8Array(buffer);
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xef &&
    bytes[1] === 0xbb &&
    bytes[2] === 0xbf
  ) {
    return {
      content: new TextDecoder('UTF-8').decode(buffer),
      encoding: 'UTF-8',
    };
  }
  if (bytes.length >= 2 && bytes[0] === 0xfe && bytes[1] === 0xff) {
    return {
      content: new TextDecoder('UTF-16BE').decode(buffer),
      encoding: 'UTF-16BE',
    };
  }
  if (bytes.length >= 2 && bytes[0] === 0xff && bytes[1] === 0xfe) {
    return {
      content: new TextDecoder('UTF-16LE').decode(buffer),
      encoding: 'UTF-16LE',
    };
  }

  // 2. 无 BOM，尝试常见中文编码
  const candidateEncodings = ['UTF-8', 'GBK', 'GB18030'];
  let bestContent = '';
  let bestEncoding = 'UTF-8';
  let minInvalid = Infinity;

  for (const enc of candidateEncodings) {
    try {
      // 使用非严格模式解码，非法字节会显示为 \uFFFD
      const decoder = new TextDecoder(enc, { fatal: false });
      const text = decoder.decode(buffer);
      // 统计替换字符数量
      const invalidCount = (text.match(/\uFFFD/g) || []).length;
      if (invalidCount < minInvalid) {
        minInvalid = invalidCount;
        bestContent = text;
        bestEncoding = enc;
      }
      // 如果完全没有乱码，直接返回
      if (invalidCount === 0) break;
    } catch {
      // 某些浏览器可能不支持某个编码名称，跳过
      continue;
    }
  }

  return { content: bestContent, encoding: bestEncoding };
}

/**
 * 从 File 对象读取并解析 TXT 内容（自动识别编码）
 */
export function parseTxtFile(file: File): Promise<TxtParseResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const buffer = reader.result as ArrayBuffer;
      try {
        const { content } = detectAndDecode(buffer);
        resolve(parseTxtContent(content));
      } catch (err) {
        reject(new Error(`解码失败: ${(err as Error).message}`));
      }
    };

    reader.onerror = () => reject(new Error('文件读取失败'));

    // 以 ArrayBuffer 形式读取，供字节级检测
    reader.readAsArrayBuffer(file);
  });
}
