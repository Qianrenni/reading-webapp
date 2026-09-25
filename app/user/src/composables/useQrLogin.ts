import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue';
import {
  useApiQrLogin,
  type QrLoginStatus,
  type QrLoginTokenData,
} from '@guga-reading/shares';

/**
 * 扫码登录面板状态：
 * - loading  正在取码
 * - pending  已出码，等待手机扫描
 * - scanned  手机已扫描，等待用户在手机上确认
 * - confirmed 已确认（令牌兑换中或已完成）
 * - expired  二维码过期/已失效，需要刷新
 * - canceled 手机端取消了本次登录
 * - failed   网络或服务端异常
 */
export type QrLoginState =
  | 'loading'
  | 'pending'
  | 'scanned'
  | 'confirmed'
  | 'expired'
  | 'canceled'
  | 'failed';

export interface UseQrLoginOptions {
  /** 轮询间隔（毫秒，默认 1500）。 */
  pollInterval?: number;
  /** 令牌兑换成功后的回调（由调用方写入 authStore）。 */
  onSuccess?: (data: QrLoginTokenData) => void;
  /**
   * 是否自动在 onMounted / onBeforeUnmount 启停轮询。
   * 单元测试可置 false，然后手动调用 [UseQrLoginResult.refresh] / [UseQrLoginResult.stop]。
   */
  autoStart?: boolean;
}

export interface UseQrLoginResult {
  /** 印在二维码里的内容。 */
  qrContent: Ref<string>;
  state: Ref<QrLoginState>;
  /** 面向用户的提示文案。 */
  tip: Ref<string>;
  /** 兑换成功后的令牌数据。 */
  tokenData: Ref<QrLoginTokenData | null>;
  /** 取一张新码并重新开始轮询。 */
  refresh: () => Promise<void>;
  /** 停止轮询（组件卸载时自动调用）。 */
  stop: () => void;
}

const DEFAULT_POLL_INTERVAL = 1500;

/** 各状态对应的提示文案。 */
const TIPS: Record<QrLoginState, string> = {
  loading: '正在获取二维码…',
  pending: '请使用手机客户端「扫一扫」扫描二维码',
  scanned: '扫描成功，请在手机上确认登录',
  confirmed: '确认成功，正在登录…',
  expired: '二维码已过期，请点击刷新',
  canceled: '已取消登录，请重新扫码',
  failed: '二维码获取失败，请点击刷新',
};

/**
 * 扫码登录组合式函数：负责「取码 → 轮询状态 → 兑换令牌」的完整流程。
 *
 * 轮询用链式 setTimeout 而非 setInterval——上一次请求返回后才排下一次，
 * 避免弱网下请求堆积；票据到期时间由后端 `expiresIn` 决定，本地到点即停，
 * 不依赖「依赖一个必然失败的请求来发现过期」。
 */
export function useQrLogin(options: UseQrLoginOptions = {}): UseQrLoginResult {
  const {
    pollInterval = DEFAULT_POLL_INTERVAL,
    onSuccess,
    autoStart = true,
  } = options;

  const qrContent = ref('');
  const state = ref<QrLoginState>('loading');
  const tip = ref(TIPS.loading);
  const tokenData = ref<QrLoginTokenData | null>(null);

  let ticket = '';
  let timer: ReturnType<typeof setTimeout> | null = null;
  let expiresAt = 0;
  // 置为 true 后所有在途请求与已排期的轮询都会失效，防止卸载后回调改状态
  let stopped = false;

  const setState = (next: QrLoginState, text?: string) => {
    state.value = next;
    tip.value = text ?? TIPS[next];
  };

  const clearTimer = () => {
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const schedule = () => {
    clearTimer();
    if (stopped) {
      return;
    }
    timer = setTimeout(() => {
      void poll();
    }, pollInterval);
  };

  /** 兑换令牌：票据在后端是一次性的，这里只调用一次。 */
  const exchange = async () => {
    const { success, data, message } = await useApiQrLogin.exchange(ticket);
    if (stopped) {
      return;
    }
    if (!success || !data) {
      setState('failed', message || TIPS.failed);
      return;
    }
    tokenData.value = data;
    onSuccess?.(data);
  };

  const applyStatus = (status: QrLoginStatus) => {
    switch (status) {
      case 'pending':
        setState('pending');
        schedule();
        return;
      case 'scanned':
        setState('scanned');
        schedule();
        return;
      case 'confirmed':
        setState('confirmed');
        void exchange();
        return;
      case 'canceled':
        setState('canceled');
        return;
      default:
        setState('expired');
    }
  };

  const poll = async () => {
    if (stopped) {
      return;
    }
    if (Date.now() >= expiresAt) {
      setState('expired');
      return;
    }
    const { success, data, message } = await useApiQrLogin.status(ticket);
    if (stopped) {
      return;
    }
    if (!success || !data) {
      // 后端判定票据已失效（过期 / 已被兑换 / 被取消）
      setState('expired', message || TIPS.expired);
      return;
    }
    applyStatus(data.status);
  };

  const refresh = async () => {
    stopped = false;
    clearTimer();
    tokenData.value = null;
    qrContent.value = '';
    setState('loading');

    const { success, data, message } = await useApiQrLogin.create();
    if (stopped) {
      return;
    }
    if (!success || !data) {
      setState('failed', message || TIPS.failed);
      return;
    }
    ticket = data.ticket;
    qrContent.value = data.qrContent;
    expiresAt = Date.now() + data.expiresIn * 1000;
    setState('pending');
    schedule();
  };

  const stop = () => {
    stopped = true;
    clearTimer();
  };

  if (autoStart) {
    onMounted(() => {
      void refresh();
    });
    onBeforeUnmount(stop);
  }

  return { qrContent, state, tip, tokenData, refresh, stop };
}
