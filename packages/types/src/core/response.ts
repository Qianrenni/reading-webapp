export interface ResponseModel<T> {
  code: number;
  data: T;
  message: string;
}
