import { SpecialityRouteResponses } from "./speciality.responses";
import { SpecialityService } from "./speciality.service";

import type { Request, Response } from "express";
import type {
  CreateSpecialitySchemaType,
  SpecialityIdParamSchemaType,
  UpdateSpecialitySchemaType,
} from "./speciality.validation";

export class SpecialityController {
  static async createSpeciality(req: Request, res: Response) {
    const { name, code, cycle, faculty, year } =
      req.body as CreateSpecialitySchemaType;

    const result = await SpecialityService.createSpeciality(
      name,
      code,
      faculty,
      cycle,
      year
    );

    if (!result.success) {
      res.sendErrorResponse(
        SpecialityRouteResponses.create.badRequest,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      SpecialityRouteResponses.create.success,
      result.data
    );
  }

  static async getAllSpecialities(req: Request, res: Response) {
    const result = await SpecialityService.getAllSpecialities();

    if (!result.success) {
      res.sendErrorResponse(
        SpecialityRouteResponses.getAll.error,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      SpecialityRouteResponses.getAll.success,
      result.data
    );
  }

  static async getSpecialityById(req: Request, res: Response) {
    const { specialityId } = req.params as SpecialityIdParamSchemaType;

    const result = await SpecialityService.getSpecialityById(specialityId);

    if (!result.success) {
      res.sendErrorResponse(
        SpecialityRouteResponses.getById.notFound,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      SpecialityRouteResponses.getById.success,
      result.data
    );
  }

  static async updateSpeciality(req: Request, res: Response) {
    const { specialityId } = req.params as SpecialityIdParamSchemaType;
    const updateData = req.body as UpdateSpecialitySchemaType;

    const result = await SpecialityService.updateSpeciality(
      specialityId,
      updateData
    );

    if (!result.success) {
      res.sendErrorResponse(
        SpecialityRouteResponses.update.badRequest,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      SpecialityRouteResponses.update.success,
      result.data
    );
  }

  static async deleteSpeciality(req: Request, res: Response) {
    const { specialityId } = req.params as SpecialityIdParamSchemaType;

    const result = await SpecialityService.deleteSpeciality(specialityId);

    if (!result.success) {
      // Check if it's a not found error or a constraint error
      if (result.errors?.[0]?.includes("associated")) {
        res.sendErrorResponse(
          SpecialityRouteResponses.delete.badRequest,
          result.errors
        );
      } else {
        res.sendErrorResponse(
          SpecialityRouteResponses.delete.notFound,
          result.errors
        );
      }
      return;
    }

    res.sendSuccessResponse(
      SpecialityRouteResponses.delete.success,
      result.data
    );
  }
}
