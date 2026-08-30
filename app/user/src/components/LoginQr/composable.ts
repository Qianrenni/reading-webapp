import { onBeforeUnmount, onMounted, ref } from 'vue';
import QRCode from 'qrcode';
import axios from 'axios';
import { useApiQrLogin, useAuthStore } from '@guga-reading/shares';
import { useMessage } from 'qyani-components';
import type { QrLoginStatus } from '@guga-reading/types';

/** 轮询间隔(毫秒):后端公开接口按 IP 限流 60 次/分钟,3 秒一次为验证码等接口预留配额 */
export const QR_POLL_INTERVAL = 3000;

/** 二维码内容协议:App 扫码后按该前缀解析出 qrId,避免误扫无关二维码 */
export const QR_LOGIN_SCHEME = 'guga://qr-login?token=';

/** 网页端描述:App 确认框展示,让用户知道是哪台设备在请求登录 */
function clientDescription(): string {
  if (typeof navigator === 'undefined') {
    return '网页端';
  }
  const ua = navigator.userAgent;
  const browser = /Edg\//.test(ua)
    ? 'Edge'
    : /Chrome\//.test(ua)
      ? 'Chrome'
      : /Firefox\//.test(ua)
        ? 'Firefox'
        : /Safari\//.test(ua)
          ? 'Safari'
          : '浏览器';
  const os = /Windows/.test(ua)
    ? 'Windows'
    : /Mac OS/.test(ua)
      ? 'macOS'
      : /Android/.test(ua)
        ? 'Android'
        : /iPhone|iPad/.test(ua)
          ? 'iOS'
          : /Linux/.test(ua)
            ? 'Linux'
            : '';
  return `网页端 ${os} ${browser}`.trim();
}

/**
 * LoginQr 扫码登录组合式函数。
 * 流程:出码 → 轮询状态 → CONFIRMED 领取一次性 confirmToken → exchange
 * 兑换正式令牌并写入 authStore(跳转由 Login.vue 对 isLogin 的 watch 统一处理)。
 * 从组件中解耦,便于单元测试。
 */
export function useQrLogin() {
  const authStore = useAuthStore();
  /** 二维码图片 data URL */
  const qrImageUrl = ref<string>('');
  /** 二维码当前状态 */
  const status = ref<QrLoginStatus>('PENDING');
  /** 出码请求进行中 */
  const creating = ref<boolean>(false);

  let qrId = '';
  let timer: ReturnType<typeof setInterval> | -1 = -1;

  const stopPolling = (): void => {
    if (timer !== -1) {
      clearInterval(timer);
      timer = -1;
    }
  };

  /** 用一次性 confirmToken 兑换正式令牌并登录 */
  const exchange = async (confirmToken: string): Promise<void> => {
    const { success, message, data } =
      await useApiQrLogin.exchangeQr(confirmToken);
    if (success && data) {
      // 与密码登录 Login.vue 的成功分支保持一致,401 拦截器和路由守卫才能正常工作
      authStore.setToken(data.accessToken, data.refreshToken, data.tokenType);
      authStore.setUser(data.user);
      axios.defaults.headers.common['Authorization'] =
        `${authStore.getTokenType} ${authStore.getAccessToken}`;
    } else {
      // confirmToken 已被消费/过期:提示后回到过期态,引导用户刷新二维码
      useMessage.error(message);
      status.value = 'EXPIRED';
    }
  };

  /** 单次轮询:更新状态;终态停表,CONFIRMED 立即兑换 */
  const pollOnce = async (): Promise<void> => {
    const { success, data } = await useApiQrLogin.qrStatus(qrId);
    if (!success || !data) {
      // 瞬时网络失败不中断轮询,等待下一次
      return;
    }
    status.value = data.status;
    if (data.status === 'CONFIRMED' && data.confirmToken) {
      stopPolling();
      await exchange(data.confirmToken);
    } else if (data.status === 'CANCELLED' || data.status === 'EXPIRED') {
      stopPolling();
    }
  };

  const startPolling = (): void => {
    stopPolling();
    timer = setInterval(() => {
      void pollOnce();
    }, QR_POLL_INTERVAL);
  };

  /** 创建/刷新二维码 */
  const createQr = async (): Promise<void> => {
    stopPolling();
    creating.value = true;
    try {
      const { success, message, data } =
        await useApiQrLogin.createQr(clientDescription());
      if (!success || !data) {
        useMessage.error(message);
        status.value = 'EXPIRED';
        return;
      }
      qrId = data.qrId;
      status.value = 'PENDING';
      qrImageUrl.value = await QRCode.toDataURL(`${QR_LOGIN_SCHEME}${qrId}`, {
        width: 180,
        margin: 1,
      });
      startPolling();
    } finally {
      creating.value = false;
    }
  };

  onMounted(() => {
    void createQr();
  });
  onBeforeUnmount(stopPolling);

  return { qrImageUrl, status, creating, createQr, pollOnce };
}
