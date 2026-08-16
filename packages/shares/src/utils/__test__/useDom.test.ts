// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';
import { useTitle, toggleFullScreen } from '../useDom';

describe('useTitle', () => {
  afterEach(() => {
    document.title = '';
  });

  it('设置 document.title', () => {
    useTitle('我的标题');
    expect(document.title).toBe('我的标题');
  });
});

describe('toggleFullScreen', () => {
  afterEach(() => {
    // 清理打桩的属性
    Reflect.deleteProperty(document.documentElement, 'requestFullscreen');
    Reflect.deleteProperty(document, 'exitFullscreen');
    Reflect.deleteProperty(document, 'fullscreenElement');
  });

  it('未全屏时进入全屏并回调 onFullScreen', () => {
    Reflect.set(document, 'fullscreenElement', null);
    Reflect.set(document.documentElement, 'requestFullscreen', vi.fn());
    const onFull = vi.fn();
    const offFull = vi.fn();

    const run = toggleFullScreen(onFull, offFull);
    run();

    expect(document.documentElement.requestFullscreen).toHaveBeenCalled();
    expect(onFull).toHaveBeenCalled();
    expect(offFull).not.toHaveBeenCalled();
  });

  it('已全屏时退出全屏并回调 offFullScreen', () => {
    Reflect.set(document, 'fullscreenElement', {});
    Reflect.set(document, 'exitFullscreen', vi.fn());
    const onFull = vi.fn();
    const offFull = vi.fn();

    const run = toggleFullScreen(onFull, offFull);
    run();

    expect(document.exitFullscreen).toHaveBeenCalled();
    expect(offFull).toHaveBeenCalled();
    expect(onFull).not.toHaveBeenCalled();
  });
});
