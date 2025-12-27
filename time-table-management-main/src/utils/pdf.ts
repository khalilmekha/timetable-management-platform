import { TimeSlot, WeekDay } from "@prisma/client";

import { getAbbreviation } from "./functions";

import type { SectionScheduleData, TeacherScheduleData } from "../types/data";
import type {
  PdfScheduleClassDataType,
  PdfScheduleDataType,
} from "../types/pdf";

export function sectionSchduleToPdfData(
  sectionSchdule: SectionScheduleData
): PdfScheduleDataType {
  const weekDays = Object.values(WeekDay) as WeekDay[];
  const timeSlots = Object.values(TimeSlot) as TimeSlot[];

  const pdfSectionSchedule = {} as PdfScheduleDataType;

  for (const day of weekDays) {
    pdfSectionSchedule[day] = {} as Record<
      TimeSlot,
      PdfScheduleClassDataType[]
    >;
    for (const slot of timeSlots) {
      const schduledClasses: PdfScheduleClassDataType[] =
        sectionSchdule.scheduledClasses
          .filter(
            (scheduledClass) =>
              scheduledClass.day === day && scheduledClass.slot === slot
          )
          .map((scheduledClass) => ({
            type: scheduledClass.type,
            courseCode: getAbbreviation(scheduledClass.courseName || "course"),
            courseName: scheduledClass.courseName,
            groupName: scheduledClass.groupName || null,
            classroomName: scheduledClass.classroomName || null,
            sectionName: sectionSchdule.sectionFullName || null,
            teacherName: scheduledClass.teacherName || null,
          }));

      pdfSectionSchedule[day][slot] = schduledClasses;
    }
  }

  return pdfSectionSchedule;
}

export function teacherSchduleToPdfData(
  sectionSchdule: TeacherScheduleData
): PdfScheduleDataType {
  const weekDays = Object.values(WeekDay) as WeekDay[];
  const timeSlots = Object.values(TimeSlot) as TimeSlot[];

  const pdfSectionSchedule = {} as PdfScheduleDataType;

  for (const day of weekDays) {
    pdfSectionSchedule[day] = {} as Record<
      TimeSlot,
      PdfScheduleClassDataType[]
    >;
    for (const slot of timeSlots) {
      const schduledClasses: PdfScheduleClassDataType[] =
        sectionSchdule.scheduledClasses
          .filter(
            (scheduledClass) =>
              scheduledClass.day === day && scheduledClass.slot === slot
          )
          .map((scheduledClass) => ({
            type: scheduledClass.type,
            courseCode: scheduledClass.courseCode,
            courseName: scheduledClass.courseName,
            groupName: scheduledClass.groupName || null,
            classroomName: scheduledClass.classroomName || null,
            sectionName: scheduledClass.sectionFullName || null,
          }));

      pdfSectionSchedule[day][slot] = schduledClasses;
    }
  }

  return pdfSectionSchedule;
}
