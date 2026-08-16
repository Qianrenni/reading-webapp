import { describe, it, expect } from 'vitest';
import { themes, textColors, bgColors, fontOptions } from '../theme';

describe('themes', () => {
  it('包含四个预设主题', () => {
    expect(Object.keys(themes)).toEqual(['day', 'night', 'eye', 'paper']);
  });

  it('每个主题包含 label/color/backgroundColor/secondBackgroundColor', () => {
    for (const theme of Object.values(themes)) {
      expect(theme.label).toBeTypeOf('string');
      expect(theme.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(theme.backgroundColor).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(theme.secondBackgroundColor).toMatch(/^#[0-9a-fA-F]{6}$/);
    }
  });

  it('夜间/护眼/羊皮纸主题色值正确', () => {
    expect(themes.night).toEqual({
      label: '夜间',
      color: '#b0b0b0',
      backgroundColor: '#1a1a1a',
      secondBackgroundColor: '#202020',
    });
    expect(themes.eye.backgroundColor).toBe('#c7edcc');
    expect(themes.paper.backgroundColor).toBe('#f5f0e1');
  });
});

describe('textColors / bgColors / fontOptions', () => {
  it('文字颜色预设为 {label, value} 结构', () => {
    expect(textColors).toHaveLength(5);
    expect(textColors[0]).toEqual({ label: '黑色', value: '#333333' });
    for (const c of textColors) {
      expect(c.value).toMatch(/^#/);
    }
  });

  it('背景颜色预设包含米色', () => {
    expect(bgColors).toHaveLength(5);
    expect(bgColors).toContainEqual({ label: '米色', value: '#faf8f3' });
  });

  it('字体选项共 8 项且默认字体为完整字族', () => {
    expect(fontOptions).toHaveLength(8);
    expect(fontOptions[0].value).toBe(
      'Arial, PingFangSC-Regular, Microsoft Yahei, SimSun',
    );
    expect(fontOptions.map((f) => f.label)).toContain('宋体');
    expect(fontOptions.map((f) => f.label)).toContain('幼圆');
  });
});
