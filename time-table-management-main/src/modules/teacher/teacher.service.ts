import { type Semester, type TeacherGender, UserRole } from "@prisma/client";

import { prismaClient } from "../../database/prisma";
import { EmailService } from "../../utils/email";
import { HashUtils } from "../../utils/hash";
import { ServiceResponse } from "../../utils/serviceResponse";
import { PdfService } from "../pdf/pdf.service";

import type { Faculty, WeekDay } from "@prisma/client";
import type {
  TeacherScheduleData,
  TeacherScheduledClassData,
} from "../../types/data";

export class TeacherService {
  static async getTeacherById(id: string) {
    const teacher = await prismaClient.teacher.findUnique({
      where: { id },
    });

    if (!teacher) {
      return ServiceResponse.fail("Teacher not found");
    }

    return ServiceResponse.success("Teacher found", teacher);
  }

  static async getAllTeachers() {
    try {
      const teachers = await prismaClient.teacher.findMany({
        orderBy: {
          lastName: "asc",
        },
        include: {
          user: true,
          primaryCourse: true,
          secondaryCourses: true,
        },
      });

      return ServiceResponse.success(
        "Teachers retrieved successfully",
        teachers
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to retrieve teachers", [error]);
    }
  }

  static async getTeacherScheduleById(id: string, semester: Semester) {
    const teacher = await prismaClient.teacher.findUnique({
      where: { id },
      include: {
        schedules: {
          where: { semester },

          include: {
            classroom: true,
            course: true,
            group: true,
            season: true,
            section: {
              include: {
                speciality: true,
              },
            },
          },
        },
      },
    });

    if (!teacher) {
      return ServiceResponse.fail("Teacher not found");
    }

    const schedules: TeacherScheduledClassData[] = teacher.schedules.map(
      (schedule) => {
        return {
          day: schedule.day,
          slot: schedule.slot,
          type: schedule.type,
          courseName: schedule.course.name,
          courseCode: schedule.course.code,
          cycle: schedule.section.speciality.cycle,
          semester: schedule.semester,
          sectionFullName: `${schedule.section.speciality.name} ${schedule.section.code}`,
          classroomName: schedule.classroom?.name || null,
          groupName: schedule.group?.name || null,
        };
      }
    );

    const teacherData: TeacherScheduleData = {
      fullName: `${teacher.firstName} ${teacher.lastName}`,
      gender: teacher.gender,
      semester: semester,
      faculty: teacher.faculty,
      season: teacher.schedules[0]?.season
        ? `${teacher.schedules[0]?.season.seasonStartYear}/${teacher.schedules[0]?.season.seasonEndYear}`
        : null,
      scheduledClasses: schedules,
    };

    return ServiceResponse.success("Teacher schedule found", teacherData);
  }

  static async generateTimetableFile(teacherId: string, semester: Semester) {
    return PdfService.generateTeacherTimetablePdf(teacherId, semester);
  }

  static async getTeacherFullScheduleById(id: string, semester: Semester) {
    const teacher = await prismaClient.teacher.findUnique({
      where: { id },
      include: {
        schedules: {
          where: { semester },

          include: {
            classroom: true,
            course: true,
            group: true,
            season: true,
            section: {
              include: {
                speciality: true,
              },
            },
          },
        },
      },
    });

    if (!teacher) {
      return ServiceResponse.fail("Teacher not found");
    }

    return ServiceResponse.success("Teacher schedule found", teacher.schedules);
  }

  static async createTeacher(
    firstName: string,
    lastName: string,
    gender: TeacherGender,
    email: string,
    phone: string,
    faculty: Faculty,
    availabilities: WeekDay[],
    primaryCourseId: string,
    secondaryCoursesIds: string[] = []
  ) {
    const { hashedPassword, password } = await HashUtils.generatePassword(8);

    const teacher = await prismaClient.teacher
      .create({
        data: {
          firstName,
          lastName,
          gender,
          email,
          phone,
          availabilities,
          faculty,
          user: {
            create: {
              firstName,
              lastName,
              email,
              hashedPassword,
              role: UserRole.Teacher,
            },
          },

          primaryCourse: {
            connect: { id: primaryCourseId },
          },

          //primaryCourseId,
          secondaryCourses: secondaryCoursesIds.length
            ? {
                connect: secondaryCoursesIds.map((id) => ({ id })),
              }
            : undefined,
        },
      })
      .catch((error: Error) => ({ error: error.message }));

    if ("error" in teacher) {
      return ServiceResponse.fail("Failed to create teacher " + teacher.error);
    }

    await EmailService.sendTeacherEmail(firstName, lastName, email, password);

    return ServiceResponse.success("Teacher created", teacher);
  }

  static async updateTeacher(
    teacherId: string,
    firstName?: string,
    lastName?: string,
    gender?: TeacherGender,
    phone?: string,
    faculty?: Faculty,
    availabilities?: WeekDay[],
    primaryCourseId?: string,
    secondaryCoursesIds?: string[]
  ) {
    try {
      const teacher = await prismaClient.teacher.findUnique({
        where: { id: teacherId },
        include: {
          user: true,
        },
      });

      if (!teacher) {
        return ServiceResponse.fail("Teacher not found");
      }

      const updatedTeacher = await prismaClient.teacher.update({
        where: { id: teacherId },
        data: {
          firstName: firstName || teacher.firstName,
          lastName: lastName || teacher.lastName,
          availabilities: availabilities || teacher.availabilities,
          gender: gender || teacher.gender,
          phone: phone || teacher.phone,
          faculty: faculty || teacher.faculty,
          primaryCourse: primaryCourseId
            ? {
                connect: { id: primaryCourseId },
              }
            : undefined,
          secondaryCourses: secondaryCoursesIds?.length
            ? {
                connect: secondaryCoursesIds.map((id) => ({ id })),
              }
            : undefined,
          user: {
            update: {
              firstName: firstName || teacher.firstName,
              lastName: lastName || teacher.lastName,
            },
          },
        },
      });

      if (!updatedTeacher) {
        return ServiceResponse.fail("Failed to update teacher");
      }

      return ServiceResponse.success(
        "Teacher updated successfully",
        updatedTeacher
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to update teacher", [error]);
    }
  }

  static async deleteTeacher(teacherId: string) {
    try {
      const teacher = await prismaClient.teacher.findUnique({
        where: { id: teacherId },
      });

      if (!teacher) {
        return ServiceResponse.fail("Teacher not found");
      }

      await prismaClient.teacher.delete({
        where: { id: teacherId },
      });

      if (teacher.userId) {
        await prismaClient.user.delete({
          where: { id: teacher.userId },
        });
      }

      return ServiceResponse.success("Teacher deleted successfully", {});
    } catch (error) {
      return ServiceResponse.fail("Failed to delete teacher", [error]);
    }
  }
}
