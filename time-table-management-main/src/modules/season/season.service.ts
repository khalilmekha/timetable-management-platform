import { prismaClient } from "../../database/prisma";
import { ServiceResponse } from "../../utils/serviceResponse";

export class SeasonService {
  static async createSeason(
    seasonStartYear: number,
    seasonEndYear: number,
    isCurrent: boolean = false
  ) {
    try {
      const season = await prismaClient.season.create({
        data: {
          seasonStartYear,
          seasonEndYear,
          isCurrent,
        },
      });

      return ServiceResponse.success(
        "Academic year created successfully",
        season
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to create academic year", [error]);
    }
  }

  static async getAllSeasons() {
    try {
      const seasons = await prismaClient.season.findMany({
        orderBy: {
          seasonStartYear: "desc",
        },
      });

      return ServiceResponse.success(
        "Academic years retrieved successfully",
        seasons
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to retrieve academic years", [error]);
    }
  }

  static async getSeasonById(id: string) {
    try {
      const season = await prismaClient.season.findUnique({
        where: { id },
      });

      if (!season) {
        return ServiceResponse.fail("Academic year not found");
      }

      return ServiceResponse.success(
        "Academic year retrieved successfully",
        season
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to retrieve academic year", [error]);
    }
  }

  static async updateSeason(
    id: string,
    data: {
      seasonStartYear?: number;
      seasonEndYear?: number;
      isCurrent?: boolean;
    }
  ) {
    try {
      const season = await prismaClient.season.update({
        where: { id },
        data,
      });

      return ServiceResponse.success(
        "Academic year updated successfully",
        season
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to update academic year", [error]);
    }
  }

  static async deleteSeason(id: string) {
    try {
      // Check if academic year exists
      const existingSeason = await prismaClient.season.findUnique({
        where: { id },
      });

      if (!existingSeason) {
        return ServiceResponse.fail("Academic year not found");
      }

      // Delete the academic year
      await prismaClient.season.delete({
        where: { id },
      });

      return ServiceResponse.success("Academic year deleted successfully", {});
    } catch (error) {
      return ServiceResponse.fail("Failed to delete academic year", [error]);
    }
  }
}
