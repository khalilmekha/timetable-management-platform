import z from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;

export const updateUserSchema = z.object({
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
}); 

export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>;
