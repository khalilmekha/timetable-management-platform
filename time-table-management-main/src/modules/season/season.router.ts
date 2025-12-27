import { Router } from "express";

import { SeasonController } from "./season.controller";
import {
  createSeasonSchema,
  seasonIdParamSchema,
  updateSeasonSchema,
} from "./season.validation";

import { AuthMiddleware } from "../../shared/middlewares/auth.middleware";
import { ValidationMiddleware } from "../../shared/middlewares/validation.middleware";

import type { ModuleRouterConfig } from "../../types/api";

const seasonRouter = Router();

// Apply authentication middleware for admin
seasonRouter.use(
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isAdministrator
);

// Create a new academic year
seasonRouter
  .route("/")
  .post(
    ValidationMiddleware.validateBody(createSeasonSchema),
    SeasonController.createSeason
  )
  .get(SeasonController.getAllSeasons);

// Get, update, or delete specific academic year by ID
seasonRouter
  .route("/:seasonId")
  .get(
    ValidationMiddleware.validateParams(seasonIdParamSchema),
    SeasonController.getSeasonById
  )
  .put(
    ValidationMiddleware.validateParams(seasonIdParamSchema),
    ValidationMiddleware.validateBody(updateSeasonSchema),
    SeasonController.updateSeason
  )
  .delete(
    ValidationMiddleware.validateParams(seasonIdParamSchema),
    SeasonController.deleteSeason
  );

export const seasonRouterConfig: ModuleRouterConfig = {
  basePath: "/season",
  apiComponentRouter: true,
  router: seasonRouter,
};
