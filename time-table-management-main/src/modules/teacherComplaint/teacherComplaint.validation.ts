import z from "zod";

import { DatabaseEnums } from "../../database/prisma";

export const teacherComplaintIdParamSchema = z.object({
  complaintId: z.string().uuid(),
});

export type TeacherComplaintIdParamSchemaType = z.infer<
  typeof teacherComplaintIdParamSchema
>;

export const teacherIdParamSchema = z.object({
  teacherId: z.string().uuid(),
});

export type TeacherIdParamSchemaType = z.infer<typeof teacherIdParamSchema>;

// Schema for creating teacher complaint
export const createTeacherComplaintSchema = z.object({
  description: z.string().min(1, "Description is required"),
});

export type CreateTeacherComplaintSchemaType = z.infer<
  typeof createTeacherComplaintSchema
>;

// Schema for updating teacher complaint
export const updateTeacherComplaintSchema = z.object({
  description: z.string().min(1, "Description is required").optional(),
  response: z.string().optional(),
  status: z.nativeEnum(DatabaseEnums.TeacherComplaintStatus).optional(),
});

export type UpdateTeacherComplaintSchemaType = z.infer<
  typeof updateTeacherComplaintSchema
>;
