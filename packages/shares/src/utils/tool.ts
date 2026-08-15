export function indexToCN(index: number): string {
  if (index < 0) {
    throw new Error('Index must be greater than or equal to 0');
  }
  const cnDigits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const cnUnits = [
    '',
    '十',
    '百',
    '千',
    '万',
    '十万',
    '百万',
    '千万',
    '亿',
    '十亿',
  ];
  const numString = index.toString();
  const result = Array.from(numString)
    .map((ch, index) => {
      const digit = parseInt(ch, 10);
      if (digit === 0) {
        return index === numString.length - 1 ? '' : '零';
      } else if (digit === 1 && index === numString.length - 2) {
        return '十';
      } else {
        return `${cnDigits[digit]}${cnUnits[numString.length - 1 - index]}`;
      }
    })
    .join('');
  return result.endsWith('零') ? result.slice(0, result.length - 1) : result;
}
