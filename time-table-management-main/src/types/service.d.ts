export type SuccessServiceResponse<T,V> = {
  success: true;
  message: string;
  data: T;
  options: V;
  error?: never;
};

export type FailServiceResponse<V> = {
  success: false;
  data: null;
  options: V;
  errors: string[];

};
