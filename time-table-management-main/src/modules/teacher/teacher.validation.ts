import z from "zod";

import { DatabaseEnums } from "../../database/prisma";

export const teacherIdSchema = z.object({
  teacherId: z.string().uuid(),
});

export type TeacherIdSchemaType = z.infer<typeof teacherIdSchema>;

export const getScheduleParamsSchema = teacherIdSchema.extend({
  semester: z.nativeEnum(DatabaseEnums.Semester),
});

export type GetScheduleParamsSchemaType = z.infer<
  typeof getScheduleParamsSchema
>;

export const teacherCreateSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  gender: z.nativeEnum(DatabaseEnums.TeacherGender),
  email: z.string().email(),
  phone: z.string(),
  faculty: z.nativeEnum(DatabaseEnums.Faculty),
  availabilities: z.nativeEnum(DatabaseEnums.WeekDay).array(),
  primaryCourseId: z.string().uuid(),
  secondaryCoursesIds: z.array(z.string().uuid()),
});

export type TeacherCreateSchemaType = z.infer<typeof teacherCreateSchema>;

export const teacherUpdateSchema = teacherCreateSchema
  .omit({
    email: true,
  })
  .partial();

export type TeacherUpdateSchemaType = z.infer<typeof teacherUpdateSchema>;

export const MyTeacherScheduleParamsSchema = z.object({
  semester: z.nativeEnum(DatabaseEnums.Semester),
});

export type MyTeacherScheduleParamsSchemaType = z.infer<
  typeof MyTeacherScheduleParamsSchema
>;
