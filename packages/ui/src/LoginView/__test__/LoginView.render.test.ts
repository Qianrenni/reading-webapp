import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import { render } from 'vitest-browser-vue';

// 渲染测试只验证组件装配；登录逻辑在 composable.test.ts 中测试
vi.mock('../composable', () => ({
  useLoginForm: () => ({
    image: ref(''),
    form: ref({
      username: '',
      password: '',
      captcha: '',
      x_captcha_id: '',
      remember: ['remember'],
    }),
    loading: ref(false),
    refreshCaptcha: vi.fn(),
    run: vi.fn(),
  }),
}));

import LoginView from '../LoginView.vue';

const qyaniStubs = {
  QFormText: true,
  QFormCheckboxGroup: true,
  QFormButton: true,
  QLazyImage: true,
  QLoading: true,
};

describe('LoginView', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('默认渲染“作者登录”标题', async () => {
    const screen = await render(LoginView, { global: { stubs: qyaniStubs } });
    await expect.element(screen.getByText('作者登录')).toBeVisible();
  });

  it('支持自定义标题', async () => {
    const screen = await render(LoginView, {
      props: { title: '管理员登录' },
      global: { stubs: qyaniStubs },
    });
    await expect.element(screen.getByText('管理员登录')).toBeVisible();
  });

  it('渲染登录按钮', async () => {
    const screen = await render(LoginView, { global: { stubs: qyaniStubs } });
    await expect.element(screen.getByText('登录')).toBeVisible();
  });
});
