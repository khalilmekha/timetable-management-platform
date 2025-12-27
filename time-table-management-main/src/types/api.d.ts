import type { Router } from "express";
import type { StatusCodes } from "http-status-codes";
export type SuccessApiResponse<T> = {
  success: true;
  message: string;
  data: T;
  errors?: never;
};

export type FailApiResponse = {
  success: false;
  message: string;
  data: undefined;
  errors: string[];
};

export type ResponseConfig = { message: string; code: StatusCodes };

export interface RouteResponsesConfig {
  [key: string]: RouteResponsesConfig | ResponseConfig;
}

export type ModuleRouterConfig = {
  router: Router;
  basePath: `/${string}`;
  apiComponentRouter?: boolean; // if true, the router will be mounted at /api/v1/<basePath>
};
