import type {
  FailServiceResponse,
  SuccessServiceResponse,
} from "../types/service";

export class ServiceResponse {
  public static success<T, V = null>(
    message: string,
    data: T,
    options: V = null as V
  ): SuccessServiceResponse<T, V> {
    return { success: true,message, data, options };
  }

  public static fail<V = null>(
    error: string,
    options: V = null as V
  ): FailServiceResponse<V> {
    return {
      success: false,
      data: null,
      errors: [error],
      options,
    };
  }
}
