import { ClassroomRouteResponses } from "./classroom.responses";
import { ClassroomService } from "./classroom.service";

import type { Request, Response } from "express";
import type {
  ClassroomIdParamSchemaType,
  CreateClassroomSchemaType,
  GetAvailableClassroomsSchemaType,
  UpdateClassroomSchemaType,
} from "./classroom.validation";

export class ClassroomController {
  static async createClassroom(req: Request, res: Response) {
    const {
      name,
      type,
      location,
      maxCapacity,
      description,
      features,
    } = req.body as CreateClassroomSchemaType;

    const result = await ClassroomService.createClassroom(
      name,
      type,
      location,
      maxCapacity,
      description,
      features
    );

    if (!result.success) {
      res.sendErrorResponse(
        ClassroomRouteResponses.create.badRequest,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      ClassroomRouteResponses.create.success,
      result.data
    );
  }
  static async getAllClassrooms(req: Request, res: Response) {
    const result = await ClassroomService.getAllClassrooms();

    if (!result.success) {
      res.sendErrorResponse(
        ClassroomRouteResponses.getAll.error,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      ClassroomRouteResponses.getAll.success,
      result.data
    );
  }
  static async getClassroomById(req: Request, res: Response) {
    const { classroomId } = req.params as ClassroomIdParamSchemaType;

    const result = await ClassroomService.getClassroomById(classroomId);

    if (!result.success) {
      res.sendErrorResponse(
        ClassroomRouteResponses.getById.notFound,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      ClassroomRouteResponses.getById.success,
      result.data
    );
  }
  static async getAvailableClassrooms(req: Request, res: Response) {
    const { day, semester, slot } =
      req.params as GetAvailableClassroomsSchemaType;

    const result = await ClassroomService.getAvailableClassrooms(
      semester,
      day,
      slot
    );

    if (!result.success) {
      res.sendErrorResponse(
        ClassroomRouteResponses.getAvailableClassrooms.error,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      ClassroomRouteResponses.getAvailableClassrooms.success,
      result.data
    );

    









  }

  static async updateClassroom(req: Request, res: Response) {
    const { classroomId } = req.params as ClassroomIdParamSchemaType;
    const updateData = req.body as UpdateClassroomSchemaType;

    const result = await ClassroomService.updateClassroom(
      classroomId,
      updateData
    );

    if (!result.success) {
      res.sendErrorResponse(
        ClassroomRouteResponses.update.badRequest,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      ClassroomRouteResponses.update.success,
      result.data
    );
  }
  static async deleteClassroom(req: Request, res: Response) {
    const { classroomId } = req.params as ClassroomIdParamSchemaType;

    const result = await ClassroomService.deleteClassroom(classroomId);

    if (!result.success) {
      // Check if the error is because of associated schedules
      if (
        result.errors?.some((err) =>
          err?.toString().includes("associated schedules")
        )
      ) {
        res.sendErrorResponse(
          ClassroomRouteResponses.delete.badRequest,
          result.errors
        );
        return;
      }

      // Otherwise assume it's not found
      res.sendErrorResponse(
        ClassroomRouteResponses.delete.notFound,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(ClassroomRouteResponses.delete.success, {});
  }
}
