import type {
  Cycle,
  CycleYear,
  Faculty,
  ScheduledClassType,
  Semester,
  Teacher,
  TeacherGender,
  TimeSlot,
  User,
  WeekDay,
} from "@prisma/client";

export type OptimizedUser = Omit<User, "hashedPassword"> & {
  hashedPassword: null;
} & {
  teacher: Teacher | null;
};

export interface ScheduledClassData {
  type: ScheduledClassType;
  day: WeekDay;
  slot: TimeSlot;
  courseCode: string;
  courseName: string;
  classroomName: string | null;
  groupName: string | null;
}

export interface SectionScheduledClassData extends ScheduledClassData {
  teacherName: string;
}

export interface TeacherScheduledClassData extends ScheduledClassData {
  sectionFullName: string;
}

export interface Scheduledata {
  faculty: Faculty;
  season: string | null;
  semester: Semester;
}

export interface SectionScheduleData extends Scheduledata {
  cycle: Cycle;
  year: CycleYear;
  specialityName: string;
  sectionFullName: string;
  scheduledClasses: SectionScheduledClassData[];
}

export interface TeacherScheduleData extends Scheduledata {
  fullName: string;
  gender: TeacherGender
  scheduledClasses: TeacherScheduledClassData[];
}
