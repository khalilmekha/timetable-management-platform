import z from "zod";

export const seasonIdParamSchema = z.object({
  seasonId: z.string().uuid(),
});

export type SeasonIdParamSchemaType = z.infer<
  typeof seasonIdParamSchema
>;

// Schema for creating academic year
export const createSeasonSchema = z.object({
  seasonStartYear: z.number().int().positive(),
  seasonEndYear: z
    .number()
    .int()
    .positive()
    .refine((data) => data > 0, {
      message: "End year must be positive",
    }),
  isCurrent: z.boolean().default(false),
});

export type CreateSeasonSchemaType = z.infer<
  typeof createSeasonSchema
>;

// Schema for updating academic year
export const updateSeasonSchema = createSeasonSchema.partial();

export type UpdateSeasonSchemaType = z.infer<
  typeof updateSeasonSchema
>;
