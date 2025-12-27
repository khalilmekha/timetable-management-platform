import z from "zod";

import { DatabaseEnums } from "../../database/prisma";

export const classroomIdParamSchema = z.object({
  classroomId: z.string().uuid(),
});

export type ClassroomIdParamSchemaType = z.infer<typeof classroomIdParamSchema>;

export const classroomAvailabilitySchema = z.object({
  semester: z.nativeEnum(DatabaseEnums.Semester),
  day: z.nativeEnum(DatabaseEnums.WeekDay),
  slot: z.nativeEnum(DatabaseEnums.TimeSlot),
});

export type ClassroomAvailabilitySchemaType = z.infer<
  typeof classroomAvailabilitySchema
>;
// Schema for creating classroom
export const createClassroomSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.nativeEnum(DatabaseEnums.ClassroomType),
  description: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  maxCapacity: z.number().int().positive("Maximum capacity must be positive"),
  features: z.array(z.nativeEnum(DatabaseEnums.ClassroomFeature)).optional(),

});

export type CreateClassroomSchemaType = z.infer<typeof createClassroomSchema>;

// Schema for updating classroom
export const updateClassroomSchema = createClassroomSchema.partial();

export type UpdateClassroomSchemaType = z.infer<typeof updateClassroomSchema>;

export const getAvailableClassroomsSchema = z.object({
  semester: z.nativeEnum(DatabaseEnums.Semester),
  day: z.nativeEnum(DatabaseEnums.WeekDay),
  slot: z.nativeEnum(DatabaseEnums.TimeSlot),
});

export type GetAvailableClassroomsSchemaType = z.infer<
  typeof getAvailableClassroomsSchema
>;
