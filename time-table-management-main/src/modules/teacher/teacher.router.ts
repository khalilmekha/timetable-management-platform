import { Router } from "express";

import { TeacherController } from "./teacher.controller";
import {
  MyTeacherScheduleParamsSchema,
  teacherCreateSchema,
  teacherUpdateSchema,
} from "./teacher.validation";

import { AuthMiddleware } from "../../shared/middlewares/auth.middleware";
import { ValidationMiddleware } from "../../shared/middlewares/validation.middleware";
import { teacherIdParamSchema } from "../teacherComplaint";

import type { ModuleRouterConfig } from "../../types/api";

const teacherRouter = Router();

teacherRouter
  .route("/")
  .all(AuthMiddleware.isAuthenticated, AuthMiddleware.isAdministrator)
  .get(TeacherController.getAllTeachers)
  .post(
    ValidationMiddleware.validateBody(teacherCreateSchema),
    TeacherController.createTeacher
  );

teacherRouter
  .route("/:teacherId")
  .all(
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.isAdministrator,
    ValidationMiddleware.validateParams(teacherIdParamSchema)
  )
  .get(TeacherController.getTeacherById)
  .put(
    ValidationMiddleware.validateBody(teacherUpdateSchema),
    TeacherController.updateTeacher
  )
  .delete(TeacherController.deleteTeacher);

teacherRouter
  .route("/me/schedule/:semester")
  .get(
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.isTeacher,
    ValidationMiddleware.validateParams(MyTeacherScheduleParamsSchema),
    TeacherController.getMyTeacherSchedule
  );

teacherRouter
  .route("/me/schedule/:semester/other/generate-pdf")
  .get(
    AuthMiddleware.isAuthenticated,
    AuthMiddleware.isTeacher,
    ValidationMiddleware.validateParams(MyTeacherScheduleParamsSchema),
    TeacherController.generateTeacherTimetablePdf
  );

export const teacherRouterConfig: ModuleRouterConfig = {
  router: teacherRouter,
  basePath: "/teacher",
  apiComponentRouter: true,
};
