import { SeasonRouteResponses } from "./season.responses";
import { SeasonService } from "./season.service";

import type { Request, Response } from "express";
import type {
  CreateSeasonSchemaType,
  SeasonIdParamSchemaType,
  UpdateSeasonSchemaType,
} from "./season.validation";

export class SeasonController {
  static async createSeason(req: Request, res: Response) {
    const { seasonStartYear, seasonEndYear, isCurrent } =
      req.body as CreateSeasonSchemaType;

    // Validate that end year is greater than start year
    if (seasonEndYear <= seasonStartYear) {
      res.sendErrorResponse(SeasonRouteResponses.create.badRequest, [
        "End year must be greater than start year",
      ]);
      return;
    }

    const result = await SeasonService.createSeason(
      seasonStartYear,
      seasonEndYear,
      isCurrent
    );

    if (!result.success) {
      res.sendErrorResponse(
        SeasonRouteResponses.create.badRequest,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      SeasonRouteResponses.create.success,
      result.data
    );
  }
  static async getAllSeasons(req: Request, res: Response) {
    const result = await SeasonService.getAllSeasons();

    if (!result.success) {
      res.sendErrorResponse(
        SeasonRouteResponses.getAll.error,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      SeasonRouteResponses.getAll.success,
      result.data
    );
  }
  static async getSeasonById(req: Request, res: Response) {
    const { seasonId } = req.params as SeasonIdParamSchemaType;

    const result =
      await SeasonService.getSeasonById(seasonId);

    if (!result.success) {
      res.sendErrorResponse(
        SeasonRouteResponses.getById.notFound,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      SeasonRouteResponses.getById.success,
      result.data
    );
  }
  static async updateSeason(req: Request, res: Response) {
    const { seasonId } = req.params as SeasonIdParamSchemaType;
    const updateData = req.body as UpdateSeasonSchemaType;

    // Validate that if both years are provided, end year is greater than start year
    if (
      updateData.seasonStartYear !== undefined &&
      updateData.seasonEndYear !== undefined &&
      updateData.seasonEndYear <= updateData.seasonStartYear
    ) {
      res.sendErrorResponse(SeasonRouteResponses.update.badRequest, [
        "End year must be greater than start year",
      ]);
      return;
    }

    const result = await SeasonService.updateSeason(
      seasonId,
      updateData
    );

    if (!result.success) {
      res.sendErrorResponse(
        SeasonRouteResponses.update.badRequest,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      SeasonRouteResponses.update.success,
      result.data
    );
  }
  static async deleteSeason(req: Request, res: Response) {
    const { seasonId } = req.params as SeasonIdParamSchemaType;

    const result = await SeasonService.deleteSeason(seasonId);

    if (!result.success) {
      // Check if the error is because of associated specialities
      if (
        result.errors?.some((err) =>
          err?.toString().includes("associated specialities")
        )
      ) {
        res.sendErrorResponse(
          SeasonRouteResponses.delete.badRequest,
          result.errors
        );
        return;
      }

      // Otherwise assume it's not found
      res.sendErrorResponse(
        SeasonRouteResponses.delete.notFound,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(SeasonRouteResponses.delete.success, {});
    return;
  }
}
