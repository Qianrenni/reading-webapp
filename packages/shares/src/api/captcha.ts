import axios from 'axios';
export const useApiCaptcha = {
  getCaptcha: async () => {
    const response = await axios.get(`/captcha/get`, {
      responseType: 'blob',
    });
    if (response.statusText === 'OK') {
      const data = response.data;
      const imageUrl = URL.createObjectURL(data);
      const x_captcha_id = response.headers['x-captcha-id'] || '';
      return {
        imageUrl,
        x_captcha_id,
      };
    }
  },
};
