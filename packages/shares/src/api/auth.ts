import { get, post } from '../utils';
import { User } from '@guga-reading/types';
export const useApiAuth = {
  authMe: async (tokenType: string, token: string) => {
    return await get<User>(`/token/auth/me`, {
      headers: {
        Authorization: `${tokenType} ${token}`,
      },
    });
  },
  login: async function (
    username: string,
    password: string,
    captcha: string,
    xCaptchaId: string,
  ) {
    return await post<{
      accessToken: string;
      refreshToken: string;
      tokenType: string;
      user: User;
    }>(
      `/token/get`,
      {
        username: username,
        password: password,
        captcha: captcha,
      },
      {
        headers: {
          'X-Captcha-Id': xCaptchaId,
        },
      },
    );
  },
  refreshToken: async function (tokenType: string, refreshToken: string) {
    return await post<{
      accessToken: string;
      refreshToken: string;
      tokenType: string;
      user: User;
    }>(
      `/token/refresh`,
      {},
      {
        headers: {
          Authorization: `${tokenType} ${refreshToken}`,
        },
      },
    );
  },
  verifyEmail: async (email: string) => {
    return await post<null>('/token/verify_email', {
      email: email,
    });
  },
  register: async (
    username: string,
    password: string,
    email: string,
    captcha: string,
    xCaptchaId: string,
    avatar: string = '',
  ) => {
    return await post<null>(
      `/user/register`,
      {
        user: {
          userName: username,
          password: password,
          email: email,
          avatar: avatar,
        },
        captcha: captcha,
      },
      {
        headers: {
          'X-Captcha-Id': xCaptchaId,
        },
      },
    );
  },
};
