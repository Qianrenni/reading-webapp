export const useValidate = {
  email(value: string) {
    const reg =
      /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    const commonEmailSuffix = [
      'qq.com',
      '163.com',
      '126.com',
      '139.com',
      'sina.com',
      'yahoo.com',
      'outlook.com',
    ];
    return reg.test(value) && commonEmailSuffix.includes(value.split('@')[1]);
  },
};
