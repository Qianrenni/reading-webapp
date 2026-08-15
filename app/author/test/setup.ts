// @guga-reading/author node 项目 setup 文件

// jsdom 未实现 matchMedia，qyani-components 模块加载时会调用
if (typeof window !== 'undefined' && !window.matchMedia) {
  (
    window as unknown as { matchMedia: (query: string) => MediaQueryList }
  ).matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

// jsdom 未完整实现 innerText
if (
  typeof HTMLElement !== 'undefined' &&
  !('innerText' in HTMLElement.prototype)
) {
  Object.defineProperty(HTMLElement.prototype, 'innerText', {
    get(this: HTMLElement) {
      return this.textContent ?? '';
    },
    set(this: HTMLElement, value: string) {
      this.textContent = value;
    },
    configurable: true,
  });
}

export {};
