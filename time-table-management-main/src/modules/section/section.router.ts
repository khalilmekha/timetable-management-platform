import { Router } from "express";

import { SectionController } from "./section.controller";
import {
  createSectionScheduleSchema,
  createSectionSchema,
  GenerateScheduleBodySchema,
  getSchduleParamsSchema,
  sectionIdParamsSchema,
  updateSectionIdParamsSchema,
  updateSectionScheduleSchema,
  updateSectionSchema,
} from "./section.validation";

import { AuthMiddleware } from "../../shared/middlewares/auth.middleware";
import { ValidationMiddleware } from "../../shared/middlewares/validation.middleware";

import type { ModuleRouterConfig } from "../../types/api";

const sectionRouter = Router();

// Apply authentication middleware to all routes
sectionRouter.use(
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isAdministrator
);

// Get all sections and create new section
sectionRouter
  .route("/")
  .get(SectionController.getAllSections)
  .post(
    ValidationMiddleware.validateBody(createSectionSchema),
    SectionController.createSection
  );

// Get, update, and delete a specific section
sectionRouter
  .route("/:sectionId")
  .get(
    ValidationMiddleware.validateParams(sectionIdParamsSchema),
    SectionController.getSectionById
  )
  .put(
    ValidationMiddleware.validateParams(sectionIdParamsSchema),
    ValidationMiddleware.validateBody(updateSectionSchema),
    SectionController.updateSection
  )
  .delete(
    ValidationMiddleware.validateParams(sectionIdParamsSchema),
    SectionController.deleteSection
  );

sectionRouter
  .route("/:sectionId/assignments/:semester")
  .post(
    ValidationMiddleware.validateParams(getSchduleParamsSchema),
    SectionController.assignSection
  );

sectionRouter
  .route("/:sectionId/schedule/:semester")
  .get(
    ValidationMiddleware.validateParams(getSchduleParamsSchema),
    SectionController.getSectionSchedule
  )
  .post(
    ValidationMiddleware.validateParams(getSchduleParamsSchema),
    ValidationMiddleware.validateBody(createSectionScheduleSchema),
    SectionController.createSectionSchedule
  );

sectionRouter
  .route("/:sectionId/schedule/:semester/:scheduleId")
  .put(
    ValidationMiddleware.validateParams(updateSectionIdParamsSchema),
    ValidationMiddleware.validateBody(updateSectionScheduleSchema),
    SectionController.updateSectionSchedule
  )
  .delete(
    ValidationMiddleware.validateParams(updateSectionIdParamsSchema),
    SectionController.deleteSectionSchedule
  );
sectionRouter
  .route("/:sectionId/schedule/:semester/other/generate")
  .post(
    ValidationMiddleware.validateParams(getSchduleParamsSchema),
    ValidationMiddleware.validateBody(GenerateScheduleBodySchema),
    SectionController.genetateSectionSchedule
  );

sectionRouter
  .route("/:sectionId/schedule/:semester/other/statistics")
  .get(
    ValidationMiddleware.validateParams(getSchduleParamsSchema),
    SectionController.getSectionScheduleStatistics
  );

sectionRouter
  .route("/:sectionId/schedule/:semester/other/generate-pdf")
  .get(
    ValidationMiddleware.validateParams(getSchduleParamsSchema),
    SectionController.generateSectionTimetablePdf
  );

export const sectionRouterConfig: ModuleRouterConfig = {
  basePath: "/section",
  apiComponentRouter: true,
  router: sectionRouter,
};
