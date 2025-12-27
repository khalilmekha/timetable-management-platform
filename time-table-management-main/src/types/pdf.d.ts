/**
 * Type definitions for school schedule data
 */

import type { ScheduledClassType, TimeSlot, WeekDay } from "@prisma/client";

export type PdfScheduleClassDataType = {
  type: ScheduledClassType;
  courseCode: string;
  courseName: string;
  sectionName?: string | null;
  groupName?: string | null;
  classroomName?: string | null;
  teacherName?: string | null;
};

export type PdfScheduleDataType = Record<
  WeekDay,
  Record<TimeSlot, PdfScheduleClassDataType[]>
>;

export interface CourseEntryProps {
  entry: PdfScheduleClassDataType;
}

export interface SchedulePDFConfig {
  pdfType: "Section" | "Teacher";
  title: string;
  year?: string;
  date: string;
  semester: string;
  faculty: string;
  season: string | null;
  schedule: PdfScheduleDataType;
}

/*
export interface BaseClass {
  type: ScheduledClassType;
  courseCode: string;
  location: string;
  teacherName?: string;
}


export interface CourseClass extends BaseClass {
  type: "Lecture" | "Online";
  group?: never; // Not applicable for courses
}

export interface GroupClass extends BaseClass {
  group: string;
  type: "PracticalWork" | "DirectedWork";
}


export type ClassScheduleItem = CourseClass | GroupClass;

export type TimeSlot = string; // Format: "HH:MM - HH:MM"


export type DaySchedule = Record<TimeSlot, ClassScheduleItem[]>;


export type WeekSchedule = Record<WeekDay, DaySchedule>;

export interface ScheduleData {
  title: string;
  collegeYear: string;
  semester: string;
  date: string;
  timeSlots: TimeSlot[];
  days: WeekDay[];
  schedule: WeekSchedule;
}
*/
