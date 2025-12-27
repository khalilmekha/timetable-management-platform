import { Router } from "express";

import { CourseController } from "./course.controller";
import {
  courseIdParamSchema,
  createCourseSchema,
  updateCourseSchema,
} from "./course.validation";

import { AuthMiddleware } from "../../shared/middlewares/auth.middleware";
import { ValidationMiddleware } from "../../shared/middlewares/validation.middleware";

import type { ModuleRouterConfig } from "../../types/api";

const courseRouter = Router();

// Apply authentication middleware for admin
courseRouter.use(
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isAdministrator
);

// Create a new course and get all courses
courseRouter
  .route("/")
  .post(
    ValidationMiddleware.validateBody(createCourseSchema),
    CourseController.createCourse
  )
  .get(CourseController.getAllCourses);

// Get, update, or delete specific course by ID
courseRouter
  .route("/:courseId")
  .get(
    ValidationMiddleware.validateParams(courseIdParamSchema),
    CourseController.getCourseById
  )
  .put(
    ValidationMiddleware.validateParams(courseIdParamSchema),
    ValidationMiddleware.validateBody(updateCourseSchema),
    CourseController.updateCourse
  )
  .delete(
    ValidationMiddleware.validateParams(courseIdParamSchema),
    CourseController.deleteCourse
  );

export const courseRouterConfig: ModuleRouterConfig = {
  basePath: "/course",
  apiComponentRouter: true,
  router: courseRouter,
};
