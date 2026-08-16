import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import { useMenuStore } from '@guga-reading/shares';
import SiderBar from '../SiderBar.vue';

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div>home</div>' } },
      { path: '/book', component: { template: '<div>book</div>' } },
      { path: '/stat', component: { template: '<div>stat</div>' } },
    ],
  });
}

describe('SiderBar', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('渲染全部菜单项', async () => {
    const menu = useMenuStore();
    menu.setMenuItems([
      { name: '书籍管理', path: '/book', icon: 'book' },
      { name: '数据统计', path: '/stat', icon: 'chart' },
    ]);

    const screen = await render(SiderBar, {
      global: { plugins: [makeRouter()], stubs: { QIcon: true } },
    });

    await expect.element(screen.getByText('书籍管理')).toBeVisible();
    await expect.element(screen.getByText('数据统计')).toBeVisible();
  });

  it('点击菜单项跳转并更新选中态', async () => {
    const menu = useMenuStore();
    menu.setMenuItems([{ name: '书籍管理', path: '/book', icon: 'book' }]);
    const router = makeRouter();

    const screen = await render(SiderBar, {
      global: { plugins: [router], stubs: { QIcon: true } },
    });

    await screen.getByText('书籍管理').click();
    await vi.waitFor(() => {
      expect(router.currentRoute.value.path).toBe('/book');
    });
    expect(menu.selectedItem).toBe('书籍管理');
  });

  it('点击当前选中项不重复跳转', async () => {
    const menu = useMenuStore();
    menu.setMenuItems([{ name: '书籍管理', path: '/book', icon: 'book' }]);
    menu.selectedItem = '书籍管理';
    const router = makeRouter();
    const replaceSpy = vi.spyOn(router, 'replace');

    const screen = await render(SiderBar, {
      global: { plugins: [router], stubs: { QIcon: true } },
    });

    await screen.getByText('书籍管理').click();
    expect(replaceSpy).not.toHaveBeenCalled();
  });
});
