import { CourseRouteResponses } from "./course.responses";
import { CourseService } from "./course.service";

import type { Request, Response } from "express";
import type {
  CourseIdParamSchemaType,
  CreateCourseSchemaType,
  UpdateCourseSchemaType,
} from "./course.validation";

export class CourseController {
  static async createCourse(req: Request, res: Response) {
    const {
      name,
      code,
      description,
      directedWorkWeeklySessions,
      practicalWorkWeeklySessions,
      lectureWeeklySessions,
      firstSemesterspecialitiesIds,
      secondSemesterspecialitiesIds,
    } = req.body as CreateCourseSchemaType;

    const result = await CourseService.createCourse(
      name,
      code,
      firstSemesterspecialitiesIds,
      secondSemesterspecialitiesIds,
      description,
      directedWorkWeeklySessions,
      practicalWorkWeeklySessions,
      lectureWeeklySessions
    );

    if (!result.success) {
      res.sendErrorResponse(
        CourseRouteResponses.create.badRequest,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(CourseRouteResponses.create.success, result.data);
  }

  static async getAllCourses(req: Request, res: Response) {
    const result = await CourseService.getAllCourses();

    if (!result.success) {
      res.sendErrorResponse(CourseRouteResponses.getAll.error, result.errors);
      return;
    }

    res.sendSuccessResponse(CourseRouteResponses.getAll.success, result.data);
  }

  static async getCourseById(req: Request, res: Response) {
    const { courseId } = req.params as CourseIdParamSchemaType;

    const result = await CourseService.getCourseById(courseId);

    if (!result.success) {
      res.sendErrorResponse(
        CourseRouteResponses.getById.notFound,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(CourseRouteResponses.getById.success, result.data);
  }

  static async updateCourse(req: Request, res: Response) {
    const { courseId } = req.params as CourseIdParamSchemaType;
    const updateData = req.body as UpdateCourseSchemaType;

    const result = await CourseService.updateCourse(courseId, updateData);

    if (!result.success) {
      res.sendErrorResponse(
        CourseRouteResponses.update.badRequest,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(CourseRouteResponses.update.success, result.data);
  }

  static async deleteCourse(req: Request, res: Response) {
    const { courseId } = req.params as CourseIdParamSchemaType;

    const result = await CourseService.deleteCourse(courseId);

    if (!result.success) {
      // Check if it's a not found error or a constraint error
      if (result.errors?.[0]?.includes("associated")) {
        res.sendErrorResponse(
          CourseRouteResponses.delete.badRequest,
          result.errors
        );
      } else {
        res.sendErrorResponse(
          CourseRouteResponses.delete.notFound,
          result.errors
        );
      }
      return;
    }

    res.sendSuccessResponse(CourseRouteResponses.delete.success, result.data);
  }
}
