import { TeacherComplaintRouteResponses } from "./teacherComplaint.responses";
import { TeacherComplaintService } from "./teacherComplaint.service";

import type { Request, Response } from "express";
import type {
  CreateTeacherComplaintSchemaType,
  TeacherComplaintIdParamSchemaType,
  TeacherIdParamSchemaType,
  UpdateTeacherComplaintSchemaType,
} from "./teacherComplaint.validation";

export class TeacherComplaintController {
  static async createTeacherComplaint(req: Request, res: Response) {
    const { description } = req.body as CreateTeacherComplaintSchemaType;
    const teacherId = req.user?.teacher?.id ?? null;
    if (!teacherId) return;

    const result = await TeacherComplaintService.createTeacherComplaint(
      teacherId,
      description
    );

    if (!result.success) {
      res.sendErrorResponse(
        TeacherComplaintRouteResponses.create.badRequest,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      TeacherComplaintRouteResponses.create.success,
      result.data
    );
  }

  static async getAllTeacherComplaints(req: Request, res: Response) {
    const result = await TeacherComplaintService.getAllTeacherComplaints();

    if (!result.success) {
      res.sendErrorResponse(
        TeacherComplaintRouteResponses.getAll.error,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      TeacherComplaintRouteResponses.getAll.success,
      result.data
    );
  }

  static async getTeacherComplaintById(req: Request, res: Response) {
    const { complaintId } = req.params as TeacherComplaintIdParamSchemaType;

    const result =
      await TeacherComplaintService.getTeacherComplaintById(complaintId);

    if (!result.success) {
      res.sendErrorResponse(
        TeacherComplaintRouteResponses.getById.notFound,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      TeacherComplaintRouteResponses.getById.success,
      result.data
    );
  }
  static async getTeacherComplaintsByTeacher(req: Request, res: Response) {
    const { teacherId } = req.params as TeacherIdParamSchemaType;

    const result =
      await TeacherComplaintService.getTeacherComplaintsByTeacher(teacherId);

    if (!result.success) {
      res.sendErrorResponse(
        TeacherComplaintRouteResponses.getByTeacher.notFound,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      TeacherComplaintRouteResponses.getByTeacher.success,
      result.data
    );
  }

  static async updateTeacherComplaint(req: Request, res: Response) {
    const { complaintId } = req.params as TeacherComplaintIdParamSchemaType;
    const updateData = req.body as UpdateTeacherComplaintSchemaType;

    const result = await TeacherComplaintService.updateTeacherComplaint(
      complaintId,
      updateData
    );

    if (!result.success) {
      res.sendErrorResponse(
        TeacherComplaintRouteResponses.update.badRequest,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      TeacherComplaintRouteResponses.update.success,
      result.data
    );
  }

  static async deleteTeacherComplaint(req: Request, res: Response) {
    const { complaintId } = req.params as TeacherComplaintIdParamSchemaType;

    const result =
      await TeacherComplaintService.deleteTeacherComplaint(complaintId);

    if (!result.success) {
      res.sendErrorResponse(
        TeacherComplaintRouteResponses.delete.notFound,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      TeacherComplaintRouteResponses.delete.success,
      result.data
    );
  }
}
