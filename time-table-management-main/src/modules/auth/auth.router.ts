import { Router } from "express";

import { AuthController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validation";

import { AuthMiddleware } from "../../shared/middlewares/auth.middleware";
import { ValidationMiddleware } from "../../shared/middlewares/validation.middleware";

import type { ModuleRouterConfig } from "../../types/api";

const authRouter = Router();

authRouter.post(
  "/login",
  ValidationMiddleware.validateBody(loginSchema),
  AuthController.login
);

// authRouter.post(
//   "/register",
//   ValidationMiddleware.validateBody(registerSchema),
//   AuthController.register
// );

authRouter.get(
  "/me",
  AuthMiddleware.isAuthenticated,
  AuthController.getMyProfile
);

// authRouter.get(
//   "/teacher/schedule/:semester",
//   AuthMiddleware.isAuthenticated,
//   AuthMiddleware.isTeacher,
//   AuthController.getMyTeacherSchedule
// );

export const authRouterConfig: ModuleRouterConfig = {
  router: authRouter,
  basePath: "/auth",
  apiComponentRouter: true,
};
