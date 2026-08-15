import type { bgColors, fontOptions, textColors, themes } from '@/constant';

/**
 * 阅读设置
 * @param fontSize  字体大小
 * @param lineHeight  行高
 * @param letterSpacing  字母间距
 * @param fontFamily  字体
 * @param color  文字颜色
 * @param backgroundColor  背景颜色
 */
export interface ReadSettings {
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  fontFamily: (typeof fontOptions)[number]['value'];
  color:
    | (typeof textColors)[number]['value']
    | (typeof themes)[keyof typeof themes]['color'];
  backgroundColor:
    | (typeof bgColors)[number]['value']
    | (typeof themes)[keyof typeof themes]['backgroundColor'];
}
