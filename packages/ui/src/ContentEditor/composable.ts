/**
 * ContentEditor 内容转换纯函数
 * 从 ContentEditor.vue 中解耦，便于单元测试。
 */

/**
 * 将纯文本转为 <p> 段落结构
 * 空输入返回一个空段落 `<p><br></p>`。
 */
export function textToParagraphs(text: string): string {
  if (!text?.trim()) return '<p><br></p>';
  const paragraphs = text
    .split(/\r?\n/)
    .map((p) => p.trim())
    .filter((p) => p !== '')
    .map((p) => `<p>${p}</p>`)
    .join('');
  return paragraphs || '<p><br></p>';
}

/**
 * 将 <p> 结构转为纯文本（以 \n 分隔）
 * 依赖 DOM 解析（jsdom/browser 环境）。
 */
export function paragraphsToText(html: string): string {
  const temp = document.createElement('div');
  temp.innerHTML = html;
  return Array.from(temp.querySelectorAll('p'))
    .map((p) => p.innerText)
    .join('\n');
}
