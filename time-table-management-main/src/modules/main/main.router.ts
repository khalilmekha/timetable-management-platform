import { Router } from "express";

import { MainController } from "./main.controller";

import type { ModuleRouterConfig } from "../../types/api";

const mainRouter = Router();

mainRouter.get("/", MainController.welcome);
mainRouter.get("/health", MainController.healthCheck);

export const mainRouterConfig: ModuleRouterConfig = {
  router: mainRouter,
  basePath: "/",
};
