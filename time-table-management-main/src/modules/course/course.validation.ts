import z from "zod";

export const courseIdParamSchema = z.object({
  courseId: z.string().uuid(),
});

export type CourseIdParamSchemaType = z.infer<typeof courseIdParamSchema>;

// Schema for creating course
export const createCourseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  code: z.string().min(1, "Code is required"),
  description: z.string().optional(),
  directedWorkWeeklySessions: z.number().int().min(0).default(0),
  practicalWorkWeeklySessions: z.number().int().min(0).default(0),
  lectureWeeklySessions: z.number().int().min(0).default(0),
  firstSemesterspecialitiesIds: z.array(z.string().uuid()),
  secondSemesterspecialitiesIds: z.array(z.string().uuid()),
});

export type CreateCourseSchemaType = z.infer<typeof createCourseSchema>;

// Schema for updating course
export const updateCourseSchema = createCourseSchema.partial();

export type UpdateCourseSchemaType = z.infer<typeof updateCourseSchema>;
