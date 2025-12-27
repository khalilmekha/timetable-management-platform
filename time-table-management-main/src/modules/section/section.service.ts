import { ClassroomType, Semester } from "@prisma/client";
import { ScheduledClassType, TimeSlot, WeekDay } from "@prisma/client";

import { prismaClient } from "../../database/prisma";
import { randomElement } from "../../utils/functions";
import { ServiceResponse } from "../../utils/serviceResponse";
import { PdfService } from "../pdf/pdf.service";

import type {
  SectionScheduleData,
  SectionScheduledClassData,
} from "../../types/data";
import type { UpdateSectionSchemaType } from "./section.validation";

export class SectionService {
  static async createSection(
    code: string,
    groupsNumber: number,
    specialityId: string
  ) {
    try {
      // Validate if speciality exists
      const speciality = await prismaClient.speciality.findUnique({
        where: { id: specialityId },
      });

      if (!speciality) {
        return ServiceResponse.fail("Speciality not found");
      }

      const section = await prismaClient.section.create({
        data: {
          code,
          specialityId,
          groups: {
            create: [
              ...Array.from({ length: groupsNumber }, (_, index) => ({
                name: `G${index + 1}`,
              })),
            ],
          },
        },
      });

      return ServiceResponse.success("Section created", section);
    } catch (error) {
      console.error("Error creating section:", error);
      return ServiceResponse.fail("Failed to create section");
    }
  }

  static async createSectionSchedule(
    sectionId: string,
    semester: Semester,
    day: WeekDay,
    slot: TimeSlot,
    courseId: string,
    teacherId: string,
    classroomId: string | null,
    classType: ScheduledClassType,
    groupsId: string | null,
    isOnline: boolean | null
  ) {
    try {
      const section = await prismaClient.section.findUnique({
        where: { id: sectionId },
        include: {
          speciality: true,
          groups: true,
        },
      });

      if (!section) {
        return ServiceResponse.fail("Section not found");
      }

      // Validate if course exists
      const course = await prismaClient.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        return ServiceResponse.fail("Course not found");
      }

      // Validate if teacher exists
      const teacher = await prismaClient.teacher.findUnique({
        where: { id: teacherId },
      });

      if (!teacher) {
        return ServiceResponse.fail("Teacher not found");
      }

      // Validate if group exists if groupsId is provided
      if (groupsId) {
        const group = await prismaClient.sectionGroup.findUnique({
          where: { id: groupsId, sectionId },
        });

        if (!group) {
          return ServiceResponse.fail("Group not found in this section");
        }
      }

      if (classroomId) {
        // Validate if classroom exists
        const classroom = await prismaClient.classroom.findUnique({
          where: { id: classroomId },
        });

        if (!classroom) {
          return ServiceResponse.fail("Classroom not found");
        }

        const isClassroomTaken = await prismaClient.classSchedule.findFirst({
          where: {
            classroomId,
            semester,
            day,
            slot,
          },
        });

        if (isClassroomTaken) {
          return ServiceResponse.fail(
            "Classroom is not available at this time"
          );
        }
      }

      // Check if a schedule already exists for this section, semester, day, and slot
      const existingSectionSchedule =
        await prismaClient.classSchedule.findFirst({
          where: {
            semester,
            day,
            slot,
            OR: [
              { sectionId, groupId: null },
              ...(groupsId ? [{ groupId: groupsId }] : []),
              { classroomId },
              { teacherId },
            ],
          },
        });

      if (existingSectionSchedule) {
        const exitsEntity =
          existingSectionSchedule.groupId === groupsId
            ? "group"
            : existingSectionSchedule.sectionId === sectionId
              ? "section"
              : existingSectionSchedule.teacherId === teacherId
                ? "teacher"
                : "classroom";

        return ServiceResponse.fail(
          `A schedule already exists for this ${exitsEntity} at this time`
        );
      }

      const currentSeason = await prismaClient.season.findFirst({
        where: {
          isCurrent: true,
        },
      });

      if (!currentSeason) {
        return ServiceResponse.fail("Current season not found");
      }

      const newSchedule = await prismaClient.classSchedule.create({
        data: {
          sectionId,
          groupId: groupsId ? groupsId : undefined,
          semester,
          day,
          slot,
          courseId,
          teacherId,
          classroomId,
          type: classType,
          seasonId: currentSeason.id,
          isOnline: isOnline ?? false,
        },
        include: {
          course: true,
          teacher: true,
          classroom: true,
          group: true,
        },
      });

      return ServiceResponse.success(
        "Section schedule created successfully",
        newSchedule
      );
    } catch (error) {
      console.error("Error creating section schedule:", error);
      return ServiceResponse.fail("Failed to create section schedule", [error]);
    }
  }

  static async deleteSectionSchedule(scheduleId: string) {
    try {
      const sectionSchedule = await prismaClient.classSchedule.findUnique({
        where: { id: scheduleId },
      });

      if (!sectionSchedule) {
        return ServiceResponse.fail("Section schedule not found");
      }

      await prismaClient.classSchedule.delete({
        where: { id: scheduleId },
      });

      return ServiceResponse.success(
        "Section schedule deleted successfully",
        {}
      );
    } catch (error) {
      console.error("Error deleting section schedule:", error);
      return ServiceResponse.fail("Failed to delete section schedule", [error]);
    }
  }

  // eslint-disable-next-line complexity
  static async updateSectionSchedule(
    scheduleId: string,
    sectionId: string,
    semester: Semester,
    day?: WeekDay,
    slot?: TimeSlot,
    courseId?: string,
    teacherId?: string,
    classroomId?: string,
    classType?: ScheduledClassType,
    groupsId?: string,
    isOnline?: boolean
  ) {
    try {
      const section = await prismaClient.section.findUnique({
        where: { id: sectionId },
        include: {
          speciality: true,
          groups: true,
        },
      });

      if (!section) {
        return ServiceResponse.fail("Section not found");
      }
      if (courseId) {
        // Validate if course exists
        const course = await prismaClient.course.findUnique({
          where: { id: courseId },
        });

        if (!course) {
          return ServiceResponse.fail("Course not found");
        }
      }
      if (teacherId) {
        // Validate if teacher exists
        const teacher = await prismaClient.teacher.findUnique({
          where: { id: teacherId },
        });

        if (!teacher) {
          return ServiceResponse.fail("Teacher not found");
        }
      }

      // Validate if group exists if groupsId is provided
      if (groupsId) {
        const group = await prismaClient.sectionGroup.findUnique({
          where: { id: groupsId, sectionId },
        });

        if (!group) {
          return ServiceResponse.fail("Group not found in this section");
        }
      }

      if (classroomId) {
        // Validate if classroom exists
        const classroom = await prismaClient.classroom.findUnique({
          where: { id: classroomId },
        });

        if (!classroom) {
          return ServiceResponse.fail("Classroom not found");
        }

        const isClassroomTaken = await prismaClient.classSchedule.findFirst({
          where: {
            classroomId,
            semester,
            day,
            slot,
          },
        });

        if (isClassroomTaken && isClassroomTaken.id !== scheduleId) {
          return ServiceResponse.fail(
            "Classroom is not available at this time"
          );
        }
      }
      // [0]
      // Check if a schedule already exists for this section, semester, day, and slot
      const existingSectionSchedule =
        await prismaClient.classSchedule.findFirst({
          where: {
            semester,
            day,
            slot,
            OR: [
              { sectionId, groupId: null },
              ...(groupsId ? [{ groupId: groupsId }] : []),
              { classroomId },
              { teacherId },
            ],
          },
        });

      if (
        existingSectionSchedule &&
        existingSectionSchedule.id !== scheduleId
      ) {
        const exitsEntity =
          existingSectionSchedule.groupId === groupsId
            ? "group"
            : existingSectionSchedule.sectionId === sectionId
              ? "section"
              : existingSectionSchedule.teacherId === teacherId
                ? "teacher"
                : "classroom";

        return ServiceResponse.fail(
          `A schedule already exists for this ${exitsEntity} at this time`
        );
      }

      const currentSeason = await prismaClient.season.findFirst({
        where: {
          isCurrent: true,
        },
      });

      if (!currentSeason) {
        return ServiceResponse.fail("Current season not found");
      }

      const newSchedule = await prismaClient.classSchedule.update({
        where: {
          id: scheduleId,
        },

        data: {
          sectionId,
          groupId: groupsId ? groupsId : undefined,
          semester,
          day,
          slot,
          courseId,
          teacherId,
          classroomId,
          type: classType,
          seasonId: currentSeason.id,
          isOnline: isOnline ?? false,
        },
        include: {
          course: true,
          teacher: true,
          classroom: true,
          group: true,
        },
      });

      return ServiceResponse.success(
        "Section schedule updated successfully",
        newSchedule
      );
    } catch (error) {
      console.error("Error updated section schedule:", error);
      return ServiceResponse.fail("Failed to updated section schedule", [
        error,
      ]);
    }
  }

  static async getAllSections() {
    try {
      const sections = await prismaClient.section.findMany({
        include: {
          speciality: {
            include: {
              firstSemesterCourses: true,
              secondSemesterCourses: true,
            },
          },
          groups: true,
        },
      });

      return ServiceResponse.success(
        "Sections retrieved successfully",
        sections
      );
    } catch (error) {
      console.error("Error retrieving sections:", error);
      return ServiceResponse.fail("Failed to retrieve sections");
    }
  }

  static async getSectionById(sectionId: string) {
    try {
      const section = await prismaClient.section.findUnique({
        where: { id: sectionId },
        include: {
          speciality: {
            include: {
              firstSemesterCourses: true,
              secondSemesterCourses: true,
            },
          },
          groups: true,
        },
      });

      if (!section) {
        return ServiceResponse.fail("Section not found");
      }

      return ServiceResponse.success("Section found", section);
    } catch (error) {
      console.error("Error retrieving section:", error);
      return ServiceResponse.fail("Error retrieving section");
    }
  }

  static async updateSection(
    sectionId: string,
    updateData: UpdateSectionSchemaType
  ) {
    try {
      // Check if section exists
      const existingSection = await prismaClient.section.findUnique({
        where: { id: sectionId },
      });

      if (!existingSection) {
        return ServiceResponse.fail("Section not found");
      }

      // Check if speciality exists if specialityId is provided
      if (updateData.specialityId) {
        const speciality = await prismaClient.speciality.findUnique({
          where: { id: updateData.specialityId },
        });

        if (!speciality) {
          return ServiceResponse.fail("Speciality not found");
        }
      }

      const updatedSection = await prismaClient.section.update({
        where: { id: sectionId },
        data: updateData,
        include: {
          speciality: true,
        },
      });

      return ServiceResponse.success(
        "Section updated successfully",
        updatedSection
      );
    } catch (error) {
      console.error("Error updating section:", error);
      return ServiceResponse.fail("Failed to update section");
    }
  }

  static async deleteSection(sectionId: string) {
    try {
      // Check if section exists
      const existingSection = await prismaClient.section.findUnique({
        where: { id: sectionId },
      });

      if (!existingSection) {
        return ServiceResponse.fail("Section not found");
      }

      // Check if there are related records that need to be deleted first
      const sectionGroups = await prismaClient.sectionGroup.findMany({
        where: { sectionId },
      });

      if (sectionGroups.length > 0) {
        // Delete all related sectionGroups first
        await prismaClient.sectionGroup.deleteMany({
          where: { sectionId },
        });
      }

      // Also delete any related course assignments
      await prismaClient.sectionCourseAssignment.deleteMany({
        where: { sectionId },
      });

      const deletedSection = await prismaClient.section.delete({
        where: { id: sectionId },
      });

      return ServiceResponse.success(
        "Section deleted successfully",
        deletedSection
      );
    } catch (error) {
      console.error("Error deleting section:", error);
      return ServiceResponse.fail("Failed to delete section");
    }
  }

  static async generateTimetableFile(sectionId: string, semester: Semester) {
    return PdfService.generateSectionTimetablePdf(sectionId, semester);
  }

  static async assignSection(sectionId: string, semester: Semester) {
    try {
      const section = await prismaClient.section.findUnique({
        where: { id: sectionId },
        include: {
          speciality: true,
          groups: true,
          schedules: {
            where: { semester },
            include: {
              course: true,
              teacher: true,
              classroom: true,
              group: true,
              section: true,
            },
          },
        },
      });

      if (!section) {
        return ServiceResponse.fail("Section not found");
      }

      const assignments = [
        ...section.schedules
          .map((schedule) => {
            return {
              id: schedule.id,
              type: schedule.type,
              teacher: schedule.teacher,
              course: schedule.course,
              section: schedule.section,
              group: schedule.group,
            };
          })
          .reduce(
            (acc, curr) => {
              const data = {
                type: curr.type,
                teacherId: curr.teacher.id,
                courseId: curr.course.id,
                sectionId: curr.section.id,
                groupId: curr.group ? curr.group.id : null,
              };

              const key = JSON.stringify(data);

              acc.set(key, data);
              return acc;
            },
            new Map<
              string,
              {
                type: ScheduledClassType;
                teacherId: string;
                courseId: string;
                sectionId: string;
                groupId: string | null;
              }
            >()
          ),
      ];

      return ServiceResponse.success(
        "Section assignment retrieved successfully",
        assignments
      );
    } catch (error) {
      console.error("Error assigning section:", error);
      return ServiceResponse.fail("Failed to assign section", [error]);
    }
  }
  static async getSectionSchedule(sectionId: string, semester: Semester) {
    const section = await prismaClient.section.findUnique({
      where: { id: sectionId },
      include: {
        speciality: true,
        schedules: {
          where: {
            semester,
          },
          include: {
            course: true,
            season: true,
            classroom: true,
            teacher: true,
            group: true,
          },
        },
      },
    });
    if (!section) {
      return ServiceResponse.fail("Section not found");
    }

    const sectionSchduledClasses: SectionScheduledClassData[] =
      section.schedules.map((schedule) => {
        return {
          id: schedule.id,
          type: schedule.type,
          day: schedule.day,
          slot: schedule.slot,
          teacherName: schedule.teacher.lastName,
          courseCode: schedule.course.code,
          courseName: schedule.course.name,
          classroomName: schedule.classroom?.name || null,
          groupName: schedule.group?.name || null,
        };
      });

    const season =
      section.schedules.length > 0
        ? `${section.schedules[0].season.seasonStartYear}/${section.schedules[0].season.seasonEndYear}`
        : null;

    const sectionSchdule: SectionScheduleData = {
      cycle: section.speciality.cycle,
      year: section.speciality.year,
      specialityName: section.speciality.name,
      faculty: section.speciality.faculty,
      sectionFullName: `${section.speciality.cycle} ${section.speciality.year} ${section.speciality.name} ${section.code}`,
      semester,
      season,
      scheduledClasses: sectionSchduledClasses,
    };

    return ServiceResponse.success("Section schedule found", sectionSchdule);
  }

  static async getSectionFullSchedule(sectionId: string, semester: Semester) {
    const sectionSchdule = await prismaClient.section.findUnique({
      where: { id: sectionId },
      include: {
        schedules: {
          where: {
            semester,
          },
          include: {
            section: {
              include: {
                speciality: true,
              },
            },
            course: true,
            season: true,
            classroom: true,
            teacher: true,
            group: true,
          },
        },
      },
    });
    if (!sectionSchdule) {
      return ServiceResponse.fail("Section not found");
    }

    return ServiceResponse.success(
      "Section schedule found",
      sectionSchdule.schedules
    );
  }

  static async getSectionScheduleStatistics(
    sectionId: string,
    semester: Semester
  ) {
    const section = await prismaClient.section.findUnique({
      where: { id: sectionId },
      include: {
        speciality: {
          include: {
            firstSemesterCourses: true,
            secondSemesterCourses: true,
          },
        },
        schedules: {
          where: { semester },
          include: {
            course: true,
            teacher: true,
            classroom: true,
            group: true,
          },
        },
        groups: true,
      },
    });
    if (!section) {
      return ServiceResponse.fail("Section not found");
    }

    const courses =
      semester === Semester.First
        ? section.speciality.firstSemesterCourses
        : section.speciality.secondSemesterCourses;

    const sectionScheduleStatistics = courses.map((course) => {
      const maxTp =
        course.practicalWorkWeeklySessions * section.groups.length || 0;
      const maxTd =
        course.directedWorkWeeklySessions * section.groups.length || 0;
      const maxCm = course.lectureWeeklySessions || 0;

      const courseSchedules = section.schedules.filter(
        (schedule) => schedule.courseId === course.id
      );

      const tpCount = courseSchedules.filter(
        (schedule) =>
          schedule.type === ScheduledClassType.PracticalWork &&
          schedule.groupId !== null
      ).length;

      const tdCount = courseSchedules.filter(
        (schedule) =>
          schedule.type === ScheduledClassType.DirectedWork &&
          schedule.groupId !== null
      ).length;

      const cmCount = courseSchedules.filter(
        (schedule) => schedule.type === ScheduledClassType.Lecture
      ).length;

      return {
        courseId: course.id,
        courseName: course.name,
        data: {
          [ScheduledClassType.PracticalWork]: {
            count: tpCount,
            needed: maxTp,
            percentage: Math.round((tpCount / maxTp) * 100) || 0,
          },
          [ScheduledClassType.DirectedWork]: {
            count: tdCount,
            needed: maxTd,
            percentage: Math.round((tdCount / maxTd) * 100) || 0,
          },
          [ScheduledClassType.Lecture]: {
            count: cmCount,
            needed: maxCm,
            percentage: Math.round((cmCount / maxCm) * 100) || 0,
          },
        },
      };
    });

    return ServiceResponse.success(
      "Section schedule statistics retrieved successfully",
      sectionScheduleStatistics
    );
  }

  static async generateSectionSchedule(
    sectionId: string,
    semester: Semester,
    assignments: {
      courseId: string;
      classType: ScheduledClassType;
      teacherId: string;
      groupId: string | null;
    }[]
  ) {
    const c1 = assignments.some(
      (assignment) =>
        assignment.classType !== ScheduledClassType.Lecture &&
        assignment.groupId === null
    );

    if (c1) {
      return ServiceResponse.fail(
        "All assignments of type TP or TD must have a groupId specified."
      );
    }

    const c2 = assignments.some(
      (assignment) =>
        assignment.classType === ScheduledClassType.Lecture &&
        assignment.groupId !== null
    );

    if (c2) {
      return ServiceResponse.fail(
        "Assignments of type CM cannot have a groupId specified."
      );
    }

    const allTeacherIds = [
      ...new Set(assignments.map((assignment) => assignment.teacherId)),
    ];

    const teachers = await prismaClient.teacher.findMany({
      where: {
        id: {
          in: allTeacherIds,
        },
      },
    });

    if (teachers.length !== allTeacherIds.length) {
      return ServiceResponse.fail("Some teacher IDs are invalid.");
    }

    const allCourseIds = [
      ...new Set(assignments.map((assignment) => assignment.courseId)),
    ];
    const courses = await prismaClient.course.findMany({
      where: {
        id: {
          in: allCourseIds,
        },
      },
    });

    if (courses.length !== allCourseIds.length) {
      return ServiceResponse.fail("Some course IDs are invalid.");
    }

    const allGroupIds = [
      ...new Set(assignments.map((assignment) => assignment.groupId)),
    ].filter((id) => id !== null);

    const groups = await prismaClient.sectionGroup.findMany({
      where: {
        id: {
          in: allGroupIds,
        },
      },
    });

    if (groups.length !== allGroupIds.length) {
      return ServiceResponse.fail("Some group IDs are invalid.");
    }

    await prismaClient.classSchedule.deleteMany({
      where: {
        sectionId: sectionId,
        semester: semester,
      },
    });
    const Weekdays: WeekDay[] = [
      WeekDay.Saturday,
      WeekDay.Sunday,
      WeekDay.Monday,
      WeekDay.Tuesday,
      WeekDay.Wednesday,
      WeekDay.Thursday,
    ];

    const TimeSlots = [
      TimeSlot.Slot1, // 8:00 - 9:30
      TimeSlot.Slot2, // 09:40-11:10
      TimeSlot.Slot3, // 11:20-12:50
      TimeSlot.Slot4, // 13:00-14:30
      TimeSlot.Slot5, // 14:40-16:10
      // TimeSlot.Slot6, // 16:20-17:50
    ];

    const allClassrooms = await prismaClient.classroom.findMany();
    const currentSeason = await prismaClient.season.findFirst({
      where: {
        isCurrent: true,
      },
    });

    if (!currentSeason) {
      throw new Error("No current season found.");
    }

    mainLoop: for (const assignment of assignments.sort(
      () => Math.random() - 0.5 // Shuffle assignments randomly
    )) {
      let i = 0;
      const isGroupMode = assignment.groupId !== null;
      const assignmentTeacher = await prismaClient.teacher.findUnique({
        where: {
          id: assignment.teacherId,
        },
      });

      if (!assignmentTeacher) {
        throw new Error(`Teacher with ID ${assignment.teacherId} not found.`);
      }

      console.log(`Processing assignment ${i}`);

      /*
                        Teacher Constrinats
                        - A teacher can only have one scheduled class per day and time slot.
                
                        */

      for (const day of Weekdays) {
        if (!assignmentTeacher.availabilities.includes(day)) {
          console.log(
            `Skipping assignment ${i} for teacher ${assignment.teacherId} on ${day} due to unavailability.`
          );
          continue; // Teacher Availability Constraint: Skip if the teacher is not available on this day
        }

        for (const slot of TimeSlots) {
          //console.log(`assignment: ${i} - ${day} - ${slot}`);
          //TODO check if the teacher is available on this day
          // [1]
          const exitsTeacher = await prismaClient.classSchedule.findFirst({
            where: {
              teacherId: assignment.teacherId,
              day: day,
              slot: slot,
              semester: semester,
            },
          });

          if (exitsTeacher) {
            console.log(
              `Skipping assignment ${i} for teacher ${assignment.teacherId} on ${day} at ${slot} due to existing class.`
            );
            continue; // Teacher Constraint: Skip if the teacher already has a class scheduled on this day and slot
          }

          if (isGroupMode) {
            const groupOrSectionStudy =
              await prismaClient.classSchedule.findFirst({
                where: {
                  OR: [
                    {
                      groupId: assignment.groupId,
                      day,
                      slot,
                      semester: semester,
                    },
                    {
                      sectionId: sectionId,
                      groupId: null,
                      day,
                      slot,
                      semester: semester,
                    },
                  ],
                },
              });

            if (groupOrSectionStudy) {
              console.log(
                `Skipping assignment ${i} for group ${assignment.groupId} on ${day} at ${slot} due to existing class.`
              );
              continue; // Group Constraint: Skip if a class already exists for this group or section on this day and slot
            }
          } else {
            const sectionStudy = await prismaClient.classSchedule.findFirst({
              where: {
                sectionId: sectionId,
                day,
                slot,
                semester: semester,
              },
            });

            if (sectionStudy) {
              console.log(
                `Skipping assignment ${i} for section ${sectionId} on ${day} at ${slot} due to existing class.`
              );
              continue; // Section Constraint: Skip if a class already exists for this section or any of its groups (sectionId) on this day and slot
            }
          }

          const possibleClassrooms = allClassrooms.filter((classroom) => {
            if (assignment.classType === ScheduledClassType.Lecture) {
              return classroom.type === ClassroomType.Amphitheater;
            } else if (
              assignment.classType === ScheduledClassType.PracticalWork
            ) {
              return classroom.type === ClassroomType.Laboratory;
            } else if (
              assignment.classType === ScheduledClassType.DirectedWork
            ) {
              return classroom.type === ClassroomType.Basic;
            }
          });

          if (possibleClassrooms.length === 0) {
            continue; // Classroom Constraint: Skip if no classrooms are possible for this class type
          }
          //TODO check classroom constraints
          const availlableClassrooms = await prismaClient.classroom.findMany({
            where: {
              id: {
                in: possibleClassrooms.map((c) => c.id), // only from possibleClassrooms
              },
              classSchedules: {
                none: {
                  day,
                  slot,
                  semester: semester,
                },
              },
            },
          });

          if (availlableClassrooms.length === 0) {
            console.log(
              `No available classrooms for assignment ${i} on ${day} at ${slot}. Skipping.`
            );
            continue; // Classroom Availability Constraint: Skip if no classrooms are available for this day and slot
          }

          const classroom = randomElement(availlableClassrooms);

          const created = await prismaClient.classSchedule.create({
            data: {
              day,
              slot,
              semester: semester,
              sectionId: sectionId,
              courseId: assignment.courseId,
              teacherId: assignment.teacherId,
              classroomId: classroom.id,
              groupId: assignment.groupId,
              type: assignment.classType,
              seasonId: currentSeason.id,
            },
          });

          if (created) {
            i++;
            continue mainLoop; // If the class is created successfully, continue to the next assignment
          }
        }
      }
      i++;
    }

    return ServiceResponse.success(
      "Section schedule generated successfully",
      {}
    );
  }
}
