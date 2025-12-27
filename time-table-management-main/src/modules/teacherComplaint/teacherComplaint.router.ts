import { Router } from "express";

import { TeacherComplaintController } from "./teacherComplaint.controller";
import {
  createTeacherComplaintSchema,
  teacherComplaintIdParamSchema,
  teacherIdParamSchema,
  updateTeacherComplaintSchema,
} from "./teacherComplaint.validation";

import { AuthMiddleware } from "../../shared/middlewares/auth.middleware";
import { ValidationMiddleware } from "../../shared/middlewares/validation.middleware";

import type { ModuleRouterConfig } from "../../types/api";

const teacherComplaintRouter = Router();

// Apply authentication middleware for admin
teacherComplaintRouter.use(AuthMiddleware.isAuthenticated);

// Create a new teacher complaint and get all complaints (Admin only)
teacherComplaintRouter
  .route("/")
  .post(
    AuthMiddleware.isTeacher,
    ValidationMiddleware.validateBody(createTeacherComplaintSchema),
    TeacherComplaintController.createTeacherComplaint
  )
  .get(
    AuthMiddleware.isAdministrator,
    TeacherComplaintController.getAllTeacherComplaints
  );

// Get all complaints for a specific teacher
teacherComplaintRouter
  .route("/teacher/:teacherId")
  .get(
    AuthMiddleware.isTeacherOrAdmin,
    ValidationMiddleware.validateParams(teacherIdParamSchema),
    TeacherComplaintController.getTeacherComplaintsByTeacher
  );

// Get, update, or delete specific teacher complaint by ID
teacherComplaintRouter
  .route("/:complaintId")
  .get(
    ValidationMiddleware.validateParams(teacherComplaintIdParamSchema),
    TeacherComplaintController.getTeacherComplaintById
  )
  .put(
    AuthMiddleware.isAdministrator,
    ValidationMiddleware.validateParams(teacherComplaintIdParamSchema),
    ValidationMiddleware.validateBody(updateTeacherComplaintSchema),
    TeacherComplaintController.updateTeacherComplaint
  )
  .delete(
    AuthMiddleware.isAdministrator,
    ValidationMiddleware.validateParams(teacherComplaintIdParamSchema),
    TeacherComplaintController.deleteTeacherComplaint
  );

export const teacherComplaintRouterConfig: ModuleRouterConfig = {
  basePath: "/teacher-complaint",
  apiComponentRouter: true,
  router: teacherComplaintRouter,
};
