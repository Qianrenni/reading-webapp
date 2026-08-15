/**
 * 用户信息
 * @param id  用户id
 * @param username  用户名
 * @param email  邮箱
 * @param avatar  头像URL
 * @param is_active  是否激活
 */
export interface User {
  id: number;
  userName: string;
  email: string;
  avatar: string;
  isActive: boolean;
}
