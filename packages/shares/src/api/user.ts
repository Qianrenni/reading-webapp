import { get, patch, useValidate } from '../utils';

export const useApiUser = {
  prefix: '/user',
  getUserCount: async function () {
    return await get<number>(`${this.prefix}/count`);
  },
  /**
   * 获取忘记密码的邮件,里面有验证码用于表单提交
   * @param email  邮箱
   * @returns  {success:boolean,data:null,message:string|null}
   */
  getForgotPassword: async function (email: string) {
    if (useValidate.email(email) === false) {
      return { success: false, data: null, message: '邮箱格式错误' };
    }
    return await get<null>(
      `${this.prefix}/forgot-password?user_account=${email}`,
    );
  },
  /**
   * 重置密码表单提交
   * @param email 邮箱
   * @param code  验证码
   * @param password  新密码
   * @param confirmPassword   确认密码
   * @returns     {success:boolean,data:null,message:string|null}
   */
  patchForgotPassword: async function (
    email: string,
    code: string,
    password: string,
    confirmPassword: string,
  ) {
    if (useValidate.email(email) === false) {
      return { success: false, data: null, message: '邮箱格式错误' };
    }
    if (password !== confirmPassword) {
      return { success: false, data: null, message: '密码不一致' };
    }
    return await patch<null>(`${this.prefix}/forgot-password`, {
      userAccount: email,
      verifyCode: code,
      password,
    });
  },
  /**
   * 修改密码
   * @param email 邮箱
   * @param oldPassword  旧密码
   * @param newPassword  新密码
   * @param confirmPassword   确认密码
   * @returns     {success:boolean,data:null,message:string|null}
   */
  updatePassword: async function (
    email: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    if (useValidate.email(email) === false) {
      return { success: false, data: null, message: '邮箱格式错误' };
    }
    if (newPassword !== confirmPassword) {
      return { success: false, data: null, message: '密码不一致' };
    }
    return await patch<null>(`${this.prefix}/update-password`, {
      userName: email,
      oldPassword,
      newPassword,
    });
  },
};
