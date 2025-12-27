import type { FailApiResponse, SuccessApiResponse } from "@/types/api";

export class ApiResponse {
  public static success<T>(message: string, data: T): SuccessApiResponse<T> {
    return { success: true, message, data };
  }

  public static error(message: string, errors: string[] = []): FailApiResponse {
    return { success: false, message, data: undefined, errors };
  }
}
