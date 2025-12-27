import { prismaClient } from "../../database/prisma";
import { ServiceResponse } from "../../utils/serviceResponse";

import type {
  ClassroomFeature,
  ClassroomType,
  Semester,
  TimeSlot,
  WeekDay,
} from "@prisma/client";
import type { ClassroomAvailabilitySchemaType } from "./classroom.validation";

export class ClassroomService {
  static async createClassroom(
    name: string,
    type: ClassroomType,
    location: string,
    maxCapacity: number,
    description?: string,
    features?: ClassroomFeature[]
  ) {
    try {
      const classroom = await prismaClient.classroom.create({
        data: {
          name,
          type,
          description,
          location,
          maxCapacity,
          features: features || [],
        },
      });

      return ServiceResponse.success(
        "Classroom created successfully",
        classroom
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to create classroom", [error]);
    }
  }

  static async getAllClassrooms() {
    try {
      const classrooms = await prismaClient.classroom.findMany({
        orderBy: {
          name: "asc",
        },
      });

      return ServiceResponse.success(
        "Classrooms retrieved successfully",
        classrooms
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to retrieve classrooms", [error]);
    }
  }

  static async getAvailableClassrooms(
    semester: Semester,
    day: WeekDay,
    slot: TimeSlot
  ) {
    try {
      const classrooms = await prismaClient.classroom.findMany({
        where: {
          classSchedules: {
            none: {
              semester,
              day,
              slot,
            },
          },
        },
      });

      return ServiceResponse.success(
        "Available classrooms retrieved successfully",
        classrooms
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to retrieve available classrooms", [
        error,
      ]);
    }
  }

  static async getClassroomById(id: string) {
    try {
      const classroom = await prismaClient.classroom.findUnique({
        where: { id },
        include: {
          classSchedules: true,
        },
      });

      if (!classroom) {
        return ServiceResponse.fail("Classroom not found");
      }

      return ServiceResponse.success(
        "Classroom retrieved successfully",
        classroom
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to retrieve classroom", [error]);
    }
  }
  static async updateClassroom(
    id: string,
    data: {
      name?: string;
      type?: ClassroomType;
      description?: string;
      location?: string;
      maxCapacity?: number;
      features?: ClassroomFeature[];
      availabilities?: ClassroomAvailabilitySchemaType[];
    }
  ) {
    try {
      // Check if classroom exists
      const existingClassroom = await prismaClient.classroom.findUnique({
        where: { id },
      });
      if (!existingClassroom) {
        return ServiceResponse.fail("Classroom not found");
      }

      const classroom = await prismaClient.classroom.update({
        where: { id },
        data: {
          ...(data.name !== undefined && { name: data.name }),
          ...(data.type !== undefined && { type: data.type }),
          ...(data.description !== undefined && {
            description: data.description,
          }),
          ...(data.location !== undefined && { location: data.location }),
          ...(data.maxCapacity !== undefined && {
            maxCapacity: data.maxCapacity,
          }),
          ...(data.features !== undefined && { features: data.features }),
          ...(data.availabilities !== undefined && {
            availabilities: {
              deleteMany: {},
              create: data.availabilities,
            },
          }),
        },
      });

      return ServiceResponse.success(
        "Classroom updated successfully",
        classroom
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to update classroom", [error]);
    }
  }

  static async deleteClassroom(id: string) {
    try {
      // Check if classroom exists
      const existingClassroom = await prismaClient.classroom.findUnique({
        where: { id },
        include: {
          classSchedules: true,
        },
      });

      if (!existingClassroom) {
        return ServiceResponse.fail("Classroom not found");
      }

      // Check if the classroom has related schedules
      if (existingClassroom.classSchedules.length > 0) {
        return ServiceResponse.fail(
          "Cannot delete classroom with associated schedules",
          []
        );
      }

      // Delete the classroom
      await prismaClient.classroom.delete({
        where: { id },
      });

      return ServiceResponse.success("Classroom deleted successfully", {});
    } catch (error) {
      return ServiceResponse.fail("Failed to delete classroom", [error]);
    }
  }
}
