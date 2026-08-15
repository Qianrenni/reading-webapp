/**
 * 将任意图片文件转换为 WebP 格式
 * @param imageFile - 源图片文件
 * @param targetImageType - 目标图片格式（目前仅支持 'webp'）
 * @param quality - WebP 质量 (0-1)，默认 0.92
 * @returns 转换后的 WebP Blob
 */
export function transformImage(
  imageFile: File,
  targetImageType: 'webp',
  quality: number = 0.92,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // 1. 校验文件是否为图片
    if (!imageFile.type.startsWith('image/')) {
      reject(new Error('文件不是图片类型'));
      return;
    }

    // 2. 读取文件为 data URL
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;

      // 3. 创建 Image 对象加载图片
      const img = new Image();
      img.onload = () => {
        // 4. 创建 Canvas 并绘制图片
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('无法获取 Canvas 2D 上下文'));
          return;
        }
        ctx.drawImage(img, 0, 0);

        // 5. 转换为 WebP Blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('图片转换失败，浏览器可能不支持 WebP 格式'));
            }
          },
          `image/${targetImageType}`,
          quality,
        );
      };

      img.onerror = () => {
        reject(new Error('图片加载失败'));
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      reject(new Error('文件读取失败'));
    };

    reader.readAsDataURL(imageFile);
  });
}

/**
 * 将字节值格式化为可读的容量字符串
 * 例: 1073741824 → "1.0 GB"
 */
export function formatBytes(bytes: number | undefined | null): string {
  if (!bytes || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const idx = Math.min(i, units.length - 1);
  const value = bytes / Math.pow(k, idx);
  return `${value.toFixed(1)} ${units[idx]}`;
}
