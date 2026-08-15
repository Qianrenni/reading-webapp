// 预设主题配置
export const themes = {
  day: {
    label: '白天',
    color: '#333333',
    backgroundColor: '#ffffff',
    secondBackgroundColor: '#f0f0f0',
  },
  night: {
    label: '夜间',
    color: '#b0b0b0',
    backgroundColor: '#1a1a1a',
    secondBackgroundColor: '#202020',
  },
  eye: {
    label: '护眼',
    color: '#2d4a2d',
    backgroundColor: '#c7edcc',
    secondBackgroundColor: '#e1f0d0',
  },
  paper: {
    label: '羊皮纸',
    color: '#5b4636',
    backgroundColor: '#f5f0e1',
    secondBackgroundColor: '#e1e1e1',
  },
} as const;
// 文字颜色预设
export const textColors = [
  { label: '黑色', value: '#333333' },
  { label: '深灰', value: '#666666' },
  { label: '绿色', value: '#2d4a2d' },
  { label: '棕色', value: '#5b4636' },
  { label: '蓝色', value: '#2c5282' },
] as const;

// 背景颜色预设
export const bgColors = [
  { label: '白色', value: '#ffffff' },
  { label: '米色', value: '#faf8f3' },
  { label: '浅绿', value: '#c7edcc' },
  { label: '浅黄', value: '#f5f0e1' },
  { label: '深灰', value: '#1a1a1a' },
] as const;
// 字体选项
export const fontOptions = [
  {
    label: '默认',
    value: 'Arial, PingFangSC-Regular, Microsoft Yahei, SimSun',
  },
  { label: '宋体', value: 'SimSun, serif' },
  { label: '黑体', value: 'SimHei, sans-serif' },
  { label: '楷体', value: 'KaiTi, serif' },
  { label: '微软雅黑', value: 'Microsoft Yahei, sans-serif' },
  { label: '仿宋', value: 'FangSong, serif' },
  { label: '隶书', value: 'LiSu, serif' },
  { label: '幼圆', value: 'YouYuan, sans-serif' },
] as const;
