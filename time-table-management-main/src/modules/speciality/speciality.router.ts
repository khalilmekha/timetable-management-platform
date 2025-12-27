import { Router } from "express";

import { SpecialityController } from "./speciality.controller";
import {
  createSpecialitySchema,
  specialityIdParamSchema,
  updateSpecialitySchema,
} from "./speciality.validation";

import { AuthMiddleware } from "../../shared/middlewares/auth.middleware";
import { ValidationMiddleware } from "../../shared/middlewares/validation.middleware";

import type { ModuleRouterConfig } from "../../types/api";

const specialityRouter = Router();

// Apply authentication middleware for admin
specialityRouter.use(
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isAdministrator
);

// Create a new speciality and get all specialities
specialityRouter
  .route("/")
  .post(
    ValidationMiddleware.validateBody(createSpecialitySchema),
    SpecialityController.createSpeciality
  )
  .get(SpecialityController.getAllSpecialities);

// Get, update, or delete specific speciality by ID
specialityRouter
  .route("/:specialityId")
  .get(
    ValidationMiddleware.validateParams(specialityIdParamSchema),
    SpecialityController.getSpecialityById
  )
  .put(
    ValidationMiddleware.validateParams(specialityIdParamSchema),
    ValidationMiddleware.validateBody(updateSpecialitySchema),
    SpecialityController.updateSpeciality
  )
  .delete(
    ValidationMiddleware.validateParams(specialityIdParamSchema),
    SpecialityController.deleteSpeciality
  );

export const specialityRouterConfig: ModuleRouterConfig = {
  basePath: "/speciality",
  apiComponentRouter: true,
  router: specialityRouter,
};
