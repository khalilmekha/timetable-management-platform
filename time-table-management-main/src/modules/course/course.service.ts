import { prismaClient } from "../../database/prisma";
import { ServiceResponse } from "../../utils/serviceResponse";

export class CourseService {
  static async createCourse(
    name: string,
    code: string,
    firstSemesterSpecialitiesIds: string[],
    secondSemesterSpecialitiesIds: string[],
    description?: string,
    directedWorkWeeklySessions: number = 0,
    practicalWorkWeeklySessions: number = 0,
    lectureWeeklySessions: number = 0
  ) {
    try {
      // Check if speciality exists
      const speciality = await prismaClient.speciality.findMany({
        where: {
          id: {
            in: [
              ...firstSemesterSpecialitiesIds,
              ...secondSemesterSpecialitiesIds,
            ],
          },
        },
      });

      if (!speciality || speciality.length === 0) {
        return ServiceResponse.fail("Speciality not found");
      }

      const course = await prismaClient.course.create({
        data: {
          name,
          code,
          description,
          directedWorkWeeklySessions,
          practicalWorkWeeklySessions,
          lectureWeeklySessions,
          firstSemesterSpecialities: {
            connect: firstSemesterSpecialitiesIds.map((id) => ({ id })),
          },
          secondSemesterSpecialities: {
            connect: secondSemesterSpecialitiesIds.map((id) => ({ id })),
          },
        },
      });

      return ServiceResponse.success("Course created successfully", course);
    } catch (error) {
      return ServiceResponse.fail("Failed to create course", [error]);
    }
  }

  static async getAllCourses() {
    try {
      const courses = await prismaClient.course.findMany({
        orderBy: {
          name: "asc",
        },
      });

      return ServiceResponse.success("Courses retrieved successfully", courses);
    } catch (error) {
      return ServiceResponse.fail("Failed to retrieve courses", [error]);
    }
  }

  static async getCourseById(id: string) {
    try {
      const course = await prismaClient.course.findUnique({
        where: { id },
        include: {
          sectionAssignments: true,
        },
      });

      if (!course) {
        return ServiceResponse.fail("Course not found");
      }

      return ServiceResponse.success("Course retrieved successfully", course);
    } catch (error) {
      return ServiceResponse.fail("Failed to retrieve course", [error]);
    }
  }

  static async updateCourse(
    id: string,
    data: {
      name?: string;
      code?: string;
      description?: string;
      directedWorkWeeklySessions?: number;
      practicalWorkWeeklySessions?: number;
      lectureWeeklySessions?: number;
      specialityId?: string;
    }
  ) {
    try {
      // Check if course exists
      const existingCourse = await prismaClient.course.findUnique({
        where: { id },
      });

      if (!existingCourse) {
        return ServiceResponse.fail("Course not found");
      }

      // If specialityId is provided, check if it exists
      if (data.specialityId) {
        const speciality = await prismaClient.speciality.findUnique({
          where: { id: data.specialityId },
        });

        if (!speciality) {
          return ServiceResponse.fail("Speciality not found");
        }
      }

      const course = await prismaClient.course.update({
        where: { id },
        data,
      });

      return ServiceResponse.success("Course updated successfully", course);
    } catch (error) {
      return ServiceResponse.fail("Failed to update course", [error]);
    }
  }

  static async deleteCourse(id: string) {
    try {
      // Check if course exists
      const existingCourse = await prismaClient.course.findUnique({
        where: { id },
        include: {
          sectionAssignments: true,
        },
      });

      if (!existingCourse) {
        return ServiceResponse.fail("Course not found");
      }

      // Check if the course has related section assignments
      if (existingCourse.sectionAssignments.length > 0) {
        return ServiceResponse.fail(
          "Cannot delete course with associated assignments"
        );
      }

      // Delete the course
      await prismaClient.course.delete({
        where: { id },
      });

      return ServiceResponse.success("Course deleted successfully", {});
    } catch (error) {
      return ServiceResponse.fail("Failed to delete course", [error]);
    }
  }
}
