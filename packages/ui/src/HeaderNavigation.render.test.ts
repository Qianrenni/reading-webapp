import { describe, it, expect, beforeEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createMemoryHistory } from 'vue-router';
import { useAuthStore } from '@guga-reading/shares';
import HeaderNavigation from './HeaderNavigation.vue';

const qyaniStubs = {
  QIcon: true,
  QAvatar: true,
  QThemeToggle: true,
  QDrawer: { template: '<div><slot /></div>' },
  SiderBar: true,
};

function makeRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<div/>' } }],
  });
}

describe('HeaderNavigation', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('未登录时显示 Author 兜底', async () => {
    const screen = await render(HeaderNavigation, {
      global: { plugins: [makeRouter()], stubs: qyaniStubs },
    });
    await expect.element(screen.getByText('Author')).toBeVisible();
  });

  it('登录后显示用户名', async () => {
    useAuthStore().setUser({ id: 1, userName: 'alice' } as never);
    const screen = await render(HeaderNavigation, {
      global: { plugins: [makeRouter()], stubs: qyaniStubs },
    });
    await expect.element(screen.getByText('alice')).toBeVisible();
  });

  it('默认头像地址为 /author/figure.webp', async () => {
    const screen = await render(HeaderNavigation, {
      global: { plugins: [makeRouter()], stubs: qyaniStubs },
    });
    const avatar = screen.container.querySelector('q-avatar-stub');
    expect(avatar?.getAttribute('url')).toBe('/author/figure.webp');
  });
});
