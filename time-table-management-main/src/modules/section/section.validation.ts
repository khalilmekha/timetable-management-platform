import z from "zod";

import { DatabaseEnums } from "../../database/prisma";

export const sectionIdParamsSchema = z.object({
  sectionId: z.string().uuid(),
});

export type SectionIdParamsSchema = z.infer<typeof sectionIdParamsSchema>;

export const getSchduleParamsSchema = sectionIdParamsSchema.extend({
  semester: z.nativeEnum(DatabaseEnums.Semester),
});
export type GetScheduleParamsSchemaType = z.infer<
  typeof getSchduleParamsSchema
>;

export const updateSectionIdParamsSchema = getSchduleParamsSchema.extend({
  scheduleId: z.string().uuid(),
});

export type UpdateSectionIdParamsSchemaType = z.infer<
  typeof updateSectionIdParamsSchema
>;

export const createSectionScheduleSchema = z.object({
  day: z.nativeEnum(DatabaseEnums.WeekDay),
  slot: z.nativeEnum(DatabaseEnums.TimeSlot),
  courseId: z.string().uuid(),
  teacherId: z.string().uuid(),
  classroomId: z.string().uuid().nullable(),
  classType: z.nativeEnum(DatabaseEnums.ScheduledClassType),
  groupsId: z.string().uuid().nullable(),
  isOnline: z.boolean().nullable(),
});

export type CreateSectionScheduleSchemaType = z.infer<
  typeof createSectionScheduleSchema
>;

export const updateSectionScheduleSchema = z.object({
  day: z.nativeEnum(DatabaseEnums.WeekDay).optional(),
  slot: z.nativeEnum(DatabaseEnums.TimeSlot).optional(),
  courseId: z.string().uuid().optional(),
  teacherId: z.string().uuid().optional(),
  classroomId: z.string().uuid().optional(),
  classType: z.nativeEnum(DatabaseEnums.ScheduledClassType).optional(),
  groupsId: z.string().uuid().nullable().optional(),
  isOnline: z.boolean().nullable().optional(),
});
export type UpdateSectionScheduleSchemaType = z.infer<
  typeof updateSectionScheduleSchema
>;

export const createSectionSchema = z.object({
  code: z.string().min(1).max(50),
  groupsNumber: z.number().int().min(1).max(10),
  specialityId: z.string().uuid(),
});

export type CreateSectionSchemaType = z.infer<typeof createSectionSchema>;

export const updateSectionSchema = z.object({
  code: z.string().min(1).max(50).optional(),
  specialityId: z.string().uuid().optional(),
});

export type UpdateSectionSchemaType = z.infer<typeof updateSectionSchema>;

export const GenerateScheduleBodySchema = z.object({
  assignments: z.array(
    z.object({
      courseId: z.string().uuid(),
      teacherId: z.string().uuid(),
      classType: z.nativeEnum(DatabaseEnums.ScheduledClassType),
      groupId: z.string().uuid().nullable(),
    })
  ),
});

export type GenerateScheduleBodySchemaType = z.infer<
  typeof GenerateScheduleBodySchema
>;
