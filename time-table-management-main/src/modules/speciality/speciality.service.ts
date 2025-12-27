import { prismaClient } from "../../database/prisma";
import { ServiceResponse } from "../../utils/serviceResponse";

import type { Cycle, CycleYear, Faculty } from "@prisma/client";

export class SpecialityService {
  static async createSpeciality(
    name: string,
    code: string,
    faculty: Faculty,
    cycle: Cycle,
    year: CycleYear
  ) {
    try {
      const speciality = await prismaClient.speciality.create({
        data: {
          name,
          code,
          faculty,
          cycle,
          year,
        },
      });

      return ServiceResponse.success(
        "Speciality created successfully",
        speciality
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to create speciality", [error]);
    }
  }

  static async getAllSpecialities() {
    try {
      const specialities = await prismaClient.speciality.findMany({
        include: {
          sections: true,
          firstSemesterCourses: true,
          secondSemesterCourses: true,
        },
        orderBy: {
          name: "asc",
        },
      });

      return ServiceResponse.success(
        "Specialities retrieved successfully",
        specialities
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to retrieve specialities", [error]);
    }
  }

  static async getSpecialityById(id: string) {
    try {
      const speciality = await prismaClient.speciality.findUnique({
        where: { id },
        include: {
          sections: true,
          firstSemesterCourses: true,
          secondSemesterCourses: true,
        },
      });

      if (!speciality) {
        return ServiceResponse.fail("Speciality not found");
      }

      return ServiceResponse.success(
        "Speciality retrieved successfully",
        speciality
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to retrieve speciality", [error]);
    }
  }

  static async updateSpeciality(
    id: string,
    data: {
      name?: string;
      code?: string;
      cycle?: Cycle;
      year?: CycleYear;
      academicYearId?: string;
    }
  ) {
    try {
      // Check if speciality exists
      const existingSpeciality = await prismaClient.speciality.findUnique({
        where: { id },
      });

      if (!existingSpeciality) {
        return ServiceResponse.fail("Speciality not found");
      }

      const speciality = await prismaClient.speciality.update({
        where: { id },
        data,
      });

      return ServiceResponse.success(
        "Speciality updated successfully",
        speciality
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to update speciality", [error]);
    }
  }

  static async deleteSpeciality(id: string) {
    try {
      // Check if speciality exists
      const existingSpeciality = await prismaClient.speciality.findUnique({
        where: { id },
        include: {
          sections: true,
          firstSemesterCourses: true,
          secondSemesterCourses: true,
        },
      });

      if (!existingSpeciality) {
        return ServiceResponse.fail("Speciality not found");
      }

      // Check if the speciality has related sections or courses
      if (existingSpeciality.sections.length > 0) {
        return ServiceResponse.fail(
          "Cannot delete speciality with associated sections"
        );
      }

      if (
        existingSpeciality.firstSemesterCourses.length > 0 ||
        existingSpeciality.secondSemesterCourses.length > 0
      ) {
        return ServiceResponse.fail(
          "Cannot delete speciality with associated courses"
        );
      }

      // Delete the speciality
      await prismaClient.speciality.delete({
        where: { id },
      });

      return ServiceResponse.success("Speciality deleted successfully", {});
    } catch (error) {
      return ServiceResponse.fail("Failed to delete speciality", [error]);
    }
  }
}
