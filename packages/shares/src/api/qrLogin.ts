import { get, post } from '../utils';
import { User } from '@guga-reading/types';

/** 二维码票据状态（与后端 `QrLoginStatus` 一一对应）。 */
export type QrLoginStatus = 'pending' | 'scanned' | 'confirmed' | 'canceled';

/** 手机端对票据的处置动作（与后端 `QrLoginAction` 一一对应）。 */
export type QrLoginAction = 'scan' | 'confirm' | 'cancel';

/** 新建的二维码票据：qrContent 印进二维码，ticket 用于轮询状态。 */
export interface QrLoginTicket {
  ticket: string;
  qrContent: string;
  /** 票据有效期（秒）。 */
  expiresIn: number;
}

/** 扫码登录成功后的令牌数据，结构与密码登录一致。 */
export interface QrLoginTokenData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  user: User;
}

/**
 * 扫码登录 API（网页端）。
 *
 * 时序：create 取码 → status 轮询 → 手机确认后 exchange 换令牌（一次性）。
 * 手机端对应接口为 `/token/qr/action`（需登录态），不在前端使用。
 */
export const useApiQrLogin = {
  /** 生成新的登录二维码票据。 */
  create: async () => {
    return await post<QrLoginTicket>(`/token/qr/create`);
  },
  /** 查询票据状态；票据已过期/已被兑换时后端返回错误。 */
  status: async (ticket: string) => {
    return await get<{ status: QrLoginStatus }>(`/token/qr/status`, {
      params: { ticket },
    });
  },
  /** 用已确认的票据兑换令牌（只能兑换一次）。 */
  exchange: async (ticket: string) => {
    return await post<QrLoginTokenData>(`/token/qr/exchange`, { ticket });
  },
};
