import { get, post } from '../utils';
import type { QrCreateData, QrStatusData, User } from '@guga-reading/types';

/** 扫码登录:网页端出码、轮询状态、兑换正式令牌 */
export const useApiQrLogin = {
  /** 创建二维码票据(公开接口,后端按 IP 限流) */
  createQr: async (client: string) => {
    return await post<QrCreateData>('/token/qr/create', {
      client: client,
    });
  },
  /** 轮询二维码状态;CONFIRMED 时返回一次性 confirmToken */
  qrStatus: async (qrId: string) => {
    return await get<QrStatusData>(`/token/qr/status`, {
      params: { qrId: qrId },
    });
  },
  /** 用一次性 confirmToken 兑换正式令牌(与密码登录响应结构一致) */
  exchangeQr: async (confirmToken: string) => {
    return await post<{
      accessToken: string;
      refreshToken: string;
      tokenType: string;
      user: User;
    }>(`/token/qr/exchange`, {
      confirmToken: confirmToken,
    });
  },
};
