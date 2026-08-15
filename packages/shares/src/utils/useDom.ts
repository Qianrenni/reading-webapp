/**
 * 设置当前页面标题
 * @param title string - 页面标题
 */
export function useTitle(title: string) {
  document.title = title;
}
/**
 * 全屏切换
 * @param onFullScreen 全屏时执行的函数
 * @param offFullScreen 退出全屏时执行的函数
 * @returns
 */
export function toggleFullScreen(
  onFullScreen?: () => void,
  offFullScreen?: () => void,
) {
  const run = () => {
    const doc = document.documentElement;
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        offFullScreen?.();
      }
    } else {
      if (doc.requestFullscreen) {
        doc.requestFullscreen();
        onFullScreen?.();
      }
    }
  };
  return run;
}
