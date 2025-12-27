import z from "zod";

import { DatabaseEnums } from "../../database/prisma";

export const specialityIdParamSchema = z.object({
  specialityId: z.string().uuid(),
});

export type SpecialityIdParamSchemaType = z.infer<
  typeof specialityIdParamSchema
>;

// Schema for creating speciality
export const createSpecialitySchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  faculty: z.nativeEnum(DatabaseEnums.Faculty),
  cycle: z.nativeEnum(DatabaseEnums.Cycle),
  year: z.nativeEnum(DatabaseEnums.CycleYear),
});

export type CreateSpecialitySchemaType = z.infer<typeof createSpecialitySchema>;

// Schema for updating speciality
export const updateSpecialitySchema = createSpecialitySchema.partial();

export type UpdateSpecialitySchemaType = z.infer<typeof updateSpecialitySchema>;
