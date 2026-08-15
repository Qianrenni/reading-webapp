/**
 * 对 HTML 应用指定的行高和字距,不进行分页
 * @param html 原始 HTML 字符串
 * @returns 应用样式后的完整 HTML 字符串
 */
export function applySpacingToHtml(html: string): string {
  if (!html.trim()) return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // 克隆 head 内容
  const headContent = Array.from(doc.head.children)
    .map((el) => el.outerHTML)
    .join('\n');

  // 添加全局样式(覆盖 img、body 等)
  const extraStyle = `
    <style>
      img {
        max-width: 100%;
        height: auto;
        display: block;
      }
    </style>
  `;

  // 获取 body 内容
  const bodyContent = doc.body.innerHTML;

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${headContent}
  ${extraStyle}
</head>
<body>
  ${bodyContent}
</body>
</html>`;
}

/**
 *
 * @param str  字符串
 * @returns  是否是html
 */
export function isHtml(str: string) {
  // 简单判断:是否包含成对的 <...> 且不是转义字符
  return /<[a-z][\s\S]*>/i.test(str.trim());
}
