import { SectionRouteResponses } from "./section.responses";
import { SectionService } from "./section.service";

import type { Request, Response } from "express";
import type {
  CreateSectionScheduleSchemaType,
  CreateSectionSchemaType,
  GenerateScheduleBodySchemaType,
  GetScheduleParamsSchemaType,
  SectionIdParamsSchema,
  UpdateSectionIdParamsSchemaType,
  UpdateSectionScheduleSchemaType,
  UpdateSectionSchemaType,
} from "./section.validation";

export class SectionController {
  static async createSection(req: Request, res: Response) {
    const { code, specialityId, groupsNumber } =
      req.body as CreateSectionSchemaType;

    const result = await SectionService.createSection(
      code,
      groupsNumber,
      specialityId
    );

    if (!result.success) {
      res.sendErrorResponse(
        SectionRouteResponses.create.badRequest,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(SectionRouteResponses.create.success, result.data);
  }

  static async assignSection(req: Request, res: Response) {
    const { sectionId, semester } = req.params as GetScheduleParamsSchemaType;

    const result = await SectionService.assignSection(sectionId, semester);

    if (!result.success) {
      res.sendErrorResponse(
        SectionRouteResponses.assignSection.badRequest,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      SectionRouteResponses.assignSection.success,
      result.data
    );
  }

  static async getAllSections(req: Request, res: Response) {
    const result = await SectionService.getAllSections();

    if (!result.success) {
      res.sendErrorResponse(
        SectionRouteResponses.getAllSections.error,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      SectionRouteResponses.getAllSections.success,
      result.data
    );
  }

  static async getSectionById(req: Request, res: Response) {
    const { sectionId } = req.params as SectionIdParamsSchema;
    const section = await SectionService.getSectionById(sectionId);

    if (!section.success) {
      res.sendErrorResponse(
        SectionRouteResponses.getSectionById.notFound,
        section.errors
      );
      return;
    }

    res.sendSuccessResponse(
      SectionRouteResponses.getSectionById.success,
      section.data
    );
  }

  static async updateSection(req: Request, res: Response) {
    const { sectionId } = req.params as SectionIdParamsSchema;
    const updateData = req.body as UpdateSectionSchemaType;

    const result = await SectionService.updateSection(sectionId, updateData);

    if (!result.success) {
      res.sendErrorResponse(
        SectionRouteResponses.updateSection.badRequest,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      SectionRouteResponses.updateSection.success,
      result.data
    );
  }

  static async deleteSection(req: Request, res: Response) {
    const { sectionId } = req.params as SectionIdParamsSchema;

    const result = await SectionService.deleteSection(sectionId);

    if (!result.success) {
      res.sendErrorResponse(
        SectionRouteResponses.deleteSection.notFound,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      SectionRouteResponses.deleteSection.success,
      result.data
    );
  }

  static async createSectionSchedule(req: Request, res: Response) {
    const { sectionId, semester } = req.params as GetScheduleParamsSchemaType;
    const {
      day,
      slot,
      courseId,
      teacherId,
      classroomId,
      classType,
      groupsId = null, // groupsId can be null, so we set a default value
      isOnline = null, // isOnline can be null, so we set a default value
    } = req.body as CreateSectionScheduleSchemaType;

    const result = await SectionService.createSectionSchedule(
      sectionId,
      semester,
      day,
      slot,
      courseId,
      teacherId,
      classroomId,
      classType,
      groupsId,
      isOnline
    );

    if (!result.success) {
      res.sendErrorResponse(
        SectionRouteResponses.createSectionSchedule.badRequest,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      SectionRouteResponses.createSectionSchedule.success,
      result.data
    );
  }

  static async updateSectionSchedule(req: Request, res: Response) {
    const { sectionId, semester, scheduleId } =
      req.params as UpdateSectionIdParamsSchemaType;
    const {
      day,
      slot,
      courseId,
      teacherId,
      classroomId,
      classType,
      groupsId, // groupsId can be null, so we set a default value
      isOnline, // isOnline can be null, so we set a default value
    } = req.body as UpdateSectionScheduleSchemaType;

    const result = await SectionService.updateSectionSchedule(
      scheduleId,
      sectionId,
      semester,
      day,
      slot,
      courseId,
      teacherId,
      classroomId,
      classType,
      groupsId ?? undefined,
      isOnline ?? undefined
    );

    if (!result.success) {
      res.sendErrorResponse(
        SectionRouteResponses.updateSectionSchedule.badRequest,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      SectionRouteResponses.updateSectionSchedule.success,
      result.data
    );
  }
  static async deleteSectionSchedule(req: Request, res: Response) {
    const { sectionId, semester, scheduleId } =
      req.params as UpdateSectionIdParamsSchemaType;
    const result = await SectionService.deleteSectionSchedule(scheduleId);

    if (!result.success) {
      res.sendErrorResponse(
        SectionRouteResponses.deleteSectionSchedule.badRequest,
        result.errors
      );
      return;
    }
    res.sendSuccessResponse(
      SectionRouteResponses.deleteSectionSchedule.success,
      result.data
    );
  }

  static async getSectionSchedule(req: Request, res: Response) {
    const { sectionId, semester } = req.params as GetScheduleParamsSchemaType;

    const sectionSchdule = await SectionService.getSectionFullSchedule(
      sectionId,
      semester
    );

    if (!sectionSchdule.success) {
      res.sendErrorResponse(
        SectionRouteResponses.getSectionSchedule.notFound,
        sectionSchdule.errors
      );
      return;
    }

    res.sendSuccessResponse(
      SectionRouteResponses.getSectionSchedule.success,
      sectionSchdule.data
    );
  }
  static async getSectionScheduleStatistics(req: Request, res: Response) {
    const { sectionId, semester } = req.params as GetScheduleParamsSchemaType;

    const sectionSchduleStatistics =
      await SectionService.getSectionScheduleStatistics(sectionId, semester);

    if (!sectionSchduleStatistics.success) {
      res.sendErrorResponse(
        SectionRouteResponses.getSectionScheduleStatistics.notFound,
        sectionSchduleStatistics.errors
      );
      return;
    }

    res.sendSuccessResponse(
      SectionRouteResponses.getSectionScheduleStatistics.success,
      sectionSchduleStatistics.data
    );
  }
  static async generateSectionTimetablePdf(req: Request, res: Response) {
    const { sectionId, semester } = req.params as GetScheduleParamsSchemaType;

    const pdfStream = await SectionService.generateTimetableFile(
      sectionId,
      semester
    );

    if (!pdfStream.success) {
      res.sendErrorResponse(
        SectionRouteResponses.generateSectionTimetablePdf.notFound,
        pdfStream.errors
      );
      return;
    }

    const generatePdfSuccessResponse =
      SectionRouteResponses.generateSectionTimetablePdf.success;

    res.setHeader("Content-Type", "application/pdf");

    // res.setHeader(
    //   "Content-Disposition",
    //   `attachment; filename=${sectionId}.pdf`
    // );

    res.status(generatePdfSuccessResponse.code);
    res.write(pdfStream.data);
    res.end();
  }

  static async genetateSectionSchedule(req: Request, res: Response) {
    const { sectionId, semester } = req.params as GetScheduleParamsSchemaType;
    const { assignments } = req.body as GenerateScheduleBodySchemaType;

    const result = await SectionService.generateSectionSchedule(
      sectionId,
      semester,
      assignments
    );

    if (!result.success) {
      res.sendErrorResponse(
        SectionRouteResponses.genetateSectionSchedule.badRequest,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      SectionRouteResponses.genetateSectionSchedule.success,
      result.data
    );
  }
}
