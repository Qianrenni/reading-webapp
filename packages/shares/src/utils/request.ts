import axios, { AxiosResponse } from 'axios';
axios.defaults.validateStatus = (status) => status >= 200 && status <= 500;
const isSuccess = (status: number) => status >= 200 && status <= 299;
import { ResponseModel } from '@guga-reading/types';
const ResponseCode = {
  SUCCESS: 0,
  FAILURE: 1,
} as const;
function responseHandler<T>(response: AxiosResponse<ResponseModel<T>>) {
  const result = response.data;
  if (
    response.headers['content-type'] === 'application/json' &&
    result?.code != undefined
  ) {
    return {
      success: result.code === ResponseCode.SUCCESS,
      data: result.data,
      message: result.message,
    };
  }
  const success = isSuccess(response.status);
  return {
    success: success,
    data: null as T,
    message: success ? '操作成功' : '操作失败',
  };
}
export async function get<T>(...args: Parameters<typeof axios.get>) {
  const response = await axios.get<ResponseModel<T>>(...args);
  return responseHandler<T>(response);
}
export async function post<T>(...args: Parameters<typeof axios.post>) {
  const response = await axios.post<ResponseModel<T>>(...args);
  return responseHandler<T>(response);
}
export async function put<T>(...args: Parameters<typeof axios.put>) {
  const response = await axios.put<ResponseModel<T>>(...args);
  return responseHandler<T>(response);
}
export async function del<T>(...args: Parameters<typeof axios.delete>) {
  const response = await axios.delete<ResponseModel<T>>(...args);
  return responseHandler<T>(response);
}
export async function patch<T>(...args: Parameters<typeof axios.patch>) {
  const response = await axios.patch<ResponseModel<T>>(...args);
  return responseHandler<T>(response);
}
export async function head<T>(...args: Parameters<typeof axios.head>) {
  const response = await axios.head<ResponseModel<T>>(...args);
  return responseHandler<T>(response);
}
export async function options<T>(...args: Parameters<typeof axios.options>) {
  const response = await axios.options<ResponseModel<T>>(...args);
  return responseHandler<T>(response);
}
export async function request<T>(...args: Parameters<typeof axios.request>) {
  const response = await axios.request<ResponseModel<T>>(...args);
  return responseHandler<T>(response);
}
