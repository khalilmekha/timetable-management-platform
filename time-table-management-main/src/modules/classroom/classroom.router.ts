import { Router } from "express";

import { ClassroomController } from "./classroom.controller";
import {
  classroomIdParamSchema,
  createClassroomSchema,
  getAvailableClassroomsSchema,
  updateClassroomSchema,
} from "./classroom.validation";

import { AuthMiddleware } from "../../shared/middlewares/auth.middleware";
import { ValidationMiddleware } from "../../shared/middlewares/validation.middleware";

import type { ModuleRouterConfig } from "../../types/api";

const classroomRouter = Router();

// Apply authentication middleware for admin
classroomRouter.use(
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isAdministrator
);

// Create a new classroom and get all classrooms
classroomRouter
  .route("/")
  .post(
    ValidationMiddleware.validateBody(createClassroomSchema),
    ClassroomController.createClassroom
  )
  .get(ClassroomController.getAllClassrooms);

classroomRouter.get(
  "/available/:semester/:weekDay/:timeSlot",
  ValidationMiddleware.validateParams(getAvailableClassroomsSchema),
  ClassroomController.getAvailableClassrooms
);

// Get, update, or delete specific classroom by ID
classroomRouter
  .route("/:classroomId")
  .get(
    ValidationMiddleware.validateParams(classroomIdParamSchema),
    ClassroomController.getClassroomById
  )
  .put(
    ValidationMiddleware.validateParams(classroomIdParamSchema),
    ValidationMiddleware.validateBody(updateClassroomSchema),
    ClassroomController.updateClassroom
  )
  .delete(
    ValidationMiddleware.validateParams(classroomIdParamSchema),
    ClassroomController.deleteClassroom
  );

export const classroomRouterConfig: ModuleRouterConfig = {
  basePath: "/classroom",
  apiComponentRouter: true,
  router: classroomRouter,
};
