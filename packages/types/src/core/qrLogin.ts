/**
 * 扫码登录相关类型
 * 字段命名与后端 QrLoginController / QrLoginService 的 DTO 保持一致
 */

/** 二维码状态机:与后端 QrLoginStatus 枚举的序列化名一致 */
export type QrLoginStatus =
  | 'PENDING'
  | 'SCANNED'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'EXPIRED';

/** POST /token/qr/create 响应数据 */
export interface QrCreateData {
  /** 二维码票据 ID,网页端渲染二维码、轮询状态时使用 */
  qrId: string;
  /** 二维码有效期(秒),过期后需刷新 */
  expireSeconds: number;
}

/** GET /token/qr/status 响应数据 */
export interface QrStatusData {
  status: QrLoginStatus;
  /** 网页端描述,随状态透传 */
  client?: string | null;
  /** 仅 CONFIRMED 时返回的一次性兑换凭证,需立即调 exchange 换取正式令牌 */
  confirmToken?: string | null;
}
