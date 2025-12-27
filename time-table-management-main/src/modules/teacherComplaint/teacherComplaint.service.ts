import { TeacherComplaintStatus } from "@prisma/client";

import { prismaClient } from "../../database/prisma";
import { ServiceResponse } from "../../utils/serviceResponse";

export class TeacherComplaintService {
  static async createTeacherComplaint(teacherId: string, description: string) {
    try {
      // Check if teacher exists
      const teacher = await prismaClient.teacher.findUnique({
        where: { id: teacherId },
      });

      if (!teacher) {
        return ServiceResponse.fail("Teacher not found");
      }

      const teacherComplaint = await prismaClient.teacherComplaint.create({
        data: {
          teacherId,
          description,
          status: TeacherComplaintStatus.Pending,
        },
      });

      return ServiceResponse.success(
        "Teacher complaint created successfully",
        teacherComplaint
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to create teacher complaint", [
        error,
      ]);
    }
  }

  static async getAllTeacherComplaints() {
    try {
      const teacherComplaints = await prismaClient.teacherComplaint.findMany({
        include: {
          teacher: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return ServiceResponse.success(
        "Teacher complaints retrieved successfully",
        teacherComplaints
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to retrieve teacher complaints", [
        error,
      ]);
    }
  }

  static async getTeacherComplaintById(id: string) {
    try {
      const teacherComplaint = await prismaClient.teacherComplaint.findUnique({
        where: { id },
        include: {
          teacher: true,
        },
      });

      if (!teacherComplaint) {
        return ServiceResponse.fail("Teacher complaint not found");
      }

      return ServiceResponse.success(
        "Teacher complaint retrieved successfully",
        teacherComplaint
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to retrieve teacher complaint", [
        error,
      ]);
    }
  }

  static async getTeacherComplaintsByTeacher(teacherId: string) {
    try {
      // Check if teacher exists
      const teacher = await prismaClient.teacher.findUnique({
        where: { id: teacherId },
      });

      if (!teacher) {
        return ServiceResponse.fail("Teacher not found");
      }

      const teacherComplaints = await prismaClient.teacherComplaint.findMany({
        where: {
          teacherId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return ServiceResponse.success(
        "Teacher complaints retrieved successfully",
        teacherComplaints
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to retrieve teacher complaints", [
        error,
      ]);
    }
  }

  static async updateTeacherComplaint(
    id: string,
    data: {
      description?: string;
      response?: string;
      status?: TeacherComplaintStatus;
    }
  ) {
    try {
      // Check if teacher complaint exists
      const existingTeacherComplaint =
        await prismaClient.teacherComplaint.findUnique({
          where: { id },
        });

      if (!existingTeacherComplaint) {
        return ServiceResponse.fail("Teacher complaint not found");
      }

      const teacherComplaint = await prismaClient.teacherComplaint.update({
        where: { id },
        data,
      });

      return ServiceResponse.success(
        "Teacher complaint updated successfully",
        teacherComplaint
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to update teacher complaint", [
        error,
      ]);
    }
  }

  static async deleteTeacherComplaint(id: string) {
    try {
      // Check if teacher complaint exists
      const existingTeacherComplaint =
        await prismaClient.teacherComplaint.findUnique({
          where: { id },
        });

      if (!existingTeacherComplaint) {
        return ServiceResponse.fail("Teacher complaint not found");
      }

      // Delete the teacher complaint
      await prismaClient.teacherComplaint.delete({
        where: { id },
      });

      return ServiceResponse.success(
        "Teacher complaint deleted successfully",
        {}
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to delete teacher complaint", [
        error,
      ]);
    }
  }
}
