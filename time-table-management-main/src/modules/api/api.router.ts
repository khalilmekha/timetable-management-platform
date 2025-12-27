import { Router } from "express";

import { ApiController } from "./api.controller";

import type { ModuleRouterConfig } from "../../types/api";

const apiRouter = Router();






apiRouter.get("/", ApiController.getApiInfo);




export const apiRouterConfig: ModuleRouterConfig = {
  router: apiRouter,
  basePath: "/api",
  apiComponentRouter: false,
};
