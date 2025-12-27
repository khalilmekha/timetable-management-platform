import type { ResponseConfig } from "../api";
import type { OptimizedUser } from "../data";

declare global {
  namespace Express {
    interface Request {
      user?: OptimizedUser;
    }

    interface Response {
      sendSuccessResponse<T>(response: ResponseConfig, data: T): void;
      sendErrorResponse(response: ResponseConfig, errors?: string[]): void;
    }
  }
}

export {};
