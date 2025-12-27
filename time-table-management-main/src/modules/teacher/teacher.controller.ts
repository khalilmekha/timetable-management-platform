import { TeacherRouteResponses } from "./teacher.responses";
import { TeacherService } from "./teacher.service";

import type { Request, Response } from "express";
import type {
  MyTeacherScheduleParamsSchemaType,
  TeacherCreateSchemaType,
  TeacherIdSchemaType,
  TeacherUpdateSchemaType,
} from "./teacher.validation";

export class TeacherController {
  static async createTeacher(req: Request, res: Response) {
    const {
      firstName,
      lastName,
      availabilities,
      email,
      faculty,
      gender,
      phone,
      primaryCourseId,
      secondaryCoursesIds,
    } = req.body as TeacherCreateSchemaType;

    const teacher = await TeacherService.createTeacher(
      firstName,
      lastName,
      gender,
      email,
      phone,
      faculty,
      availabilities,
      primaryCourseId,
      secondaryCoursesIds
    );

    if (!teacher.success) {
      console.error("Error creating teacher:", teacher.errors);
      res.sendErrorResponse(
        TeacherRouteResponses.createTeacher.fail,
        teacher.errors
      );
      return;
    }

    res.sendSuccessResponse(
      TeacherRouteResponses.createTeacher.success,
      teacher.data
    );
  }

  static async updateTeacher(req: Request, res: Response) {
    const { teacherId } = req.params as TeacherIdSchemaType;
    const {
      firstName,
      lastName,
      availabilities,
      faculty,
      gender,
      phone,
      primaryCourseId,
      secondaryCoursesIds,
    } = req.body as TeacherUpdateSchemaType;

    const teacher = await TeacherService.updateTeacher(
      teacherId,
      firstName,
      lastName,
      gender,
      phone,
      faculty,
      availabilities,
      primaryCourseId,
      secondaryCoursesIds
    );

    if (!teacher.success) {
      res.sendErrorResponse(
        TeacherRouteResponses.updateTeacher.fail,
        teacher.errors
      );
      return;
    }

    res.sendSuccessResponse(
      TeacherRouteResponses.updateTeacher.success,
      teacher.data
    );
  }

  static async deleteTeacher(req: Request, res: Response) {
    const { teacherId } = req.params as TeacherIdSchemaType;
    const result = await TeacherService.deleteTeacher(teacherId);
    if (!result.success) {
      res.sendErrorResponse(
        TeacherRouteResponses.deleteTeacher.notFound,
        result.errors
      );
      return;
    }
    res.sendSuccessResponse(
      TeacherRouteResponses.deleteTeacher.success,
      result.data
    );
  }

  public static async getMyTeacherSchedule(req: Request, res: Response) {
    const { semester } = req.params as MyTeacherScheduleParamsSchemaType;

    const teacherId = req.user?.teacher?.id || null;

    if (!teacherId) {
      res.sendErrorResponse(
        TeacherRouteResponses.getMyTeacherSchedule.notFound
      );
      return;
    }

    const teacherSchedule = await TeacherService.getTeacherFullScheduleById(
      teacherId,
      semester
    );

    if (!teacherSchedule.success) {
      res.sendErrorResponse(
        TeacherRouteResponses.getMyTeacherSchedule.notFound,
        teacherSchedule.errors
      );
      return;
    }

    res.sendSuccessResponse(
      TeacherRouteResponses.getMyTeacherSchedule.success,
      teacherSchedule.data
    );
  }

  static async getTeacherById(req: Request, res: Response) {
    const { teacherId } = req.params as TeacherIdSchemaType;

    const teacher = await TeacherService.getTeacherById(teacherId);

    if (!teacher.success) {
      res.sendErrorResponse(
        TeacherRouteResponses.getTeacherById.notFound,
        teacher.errors
      );
      return;
    }

    res.sendSuccessResponse(
      TeacherRouteResponses.getTeacherById.success,
      teacher.data
    );
  }

  static async getAllTeachers(req: Request, res: Response) {
    const teachers = await TeacherService.getAllTeachers();

    if (!teachers.success) {
      res.sendErrorResponse(
        TeacherRouteResponses.getAllTeachers.notFound,
        teachers.errors
      );
      return;
    }

    res.sendSuccessResponse(
      TeacherRouteResponses.getAllTeachers.success,
      teachers.data
    );
  }

  static async generateTeacherTimetablePdf(req: Request, res: Response) {
    const { semester } = req.params as MyTeacherScheduleParamsSchemaType;
    const teacherId = req.user?.teacher?.id || null;
    if (!teacherId) return;

    const pdfStream = await TeacherService.generateTimetableFile(
      teacherId,
      semester
    );

    if (!pdfStream.success) {
      res.sendErrorResponse(
        TeacherRouteResponses.generateTeacherTimetablePdf.notFound,
        pdfStream.errors
      );
      return;
    }

    const generatePdfSuccessResponse =
      TeacherRouteResponses.generateTeacherTimetablePdf.success;

    res.setHeader("Content-Type", "application/pdf");

    // res.setHeader(
    //   "Content-Disposition",
    //   `attachment; filename=${sectionId}.pdf`
    // );

    res.status(generatePdfSuccessResponse.code);
    res.write(pdfStream.data);
    res.end();
  }
}
