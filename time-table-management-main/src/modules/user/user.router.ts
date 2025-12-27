import { Router } from "express";

import { UserController } from "./user.controller";
import {
  changePasswordSchema,
  createUserSchema,
  updateUserSchema,
  userIdParamSchema,
} from "./user.validation";

import { AuthMiddleware } from "../../shared/middlewares/auth.middleware";
import { ValidationMiddleware } from "../../shared/middlewares/validation.middleware";

import type { ModuleRouterConfig } from "../../types/api";

const userRouter = Router();

// Only administrators can access these routes by default
userRouter.use(AuthMiddleware.isAuthenticated, AuthMiddleware.isAdministrator);

// GET /api/users - Get all users
userRouter.get("/", UserController.getAllUsers);

// GET /api/users/:userId - Get user by ID

// POST /api/users - Create a new user
userRouter.post(
  "/",
  ValidationMiddleware.validateBody(createUserSchema),
  UserController.createUser
);

userRouter
  .route("/:userId")
  .get(
    ValidationMiddleware.validateParams(userIdParamSchema),
    UserController.getUserById
  )
  .put(
    ValidationMiddleware.validateParams(userIdParamSchema),
    ValidationMiddleware.validateBody(updateUserSchema),
    UserController.updateUser
  )
  .delete(
    ValidationMiddleware.validateParams(userIdParamSchema),
    UserController.deleteUser
  );

// POST /api/users/:userId/change-password - Change user password
userRouter.post(
  "/:userId/change-password",
  ValidationMiddleware.validateParams(userIdParamSchema),
  ValidationMiddleware.validateBody(changePasswordSchema),
  UserController.changePassword
);

export const userRouterConfig: ModuleRouterConfig = {
  router: userRouter,
  basePath: "/user",
  apiComponentRouter: true,
};
