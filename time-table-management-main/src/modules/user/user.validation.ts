import z from "zod";

import { DatabaseEnums } from "../../database/prisma";

export const userIdParamSchema = z.object({
  userId: z.string().uuid(),
});

export type UserIdParamSchemaType = z.infer<typeof userIdParamSchema>;

// Schema for creating user
export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.nativeEnum(DatabaseEnums.UserRole).default(DatabaseEnums.UserRole.Teacher),
});

export type CreateUserSchemaType = z.infer<typeof createUserSchema>;

// Schema for updating user
export const updateUserSchema = z.object({
  email: z.string().email("Invalid email address").optional(),
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  role: z.nativeEnum(DatabaseEnums.UserRole).optional(),
});

export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>;

// Schema for changing password
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export type ChangePasswordSchemaType = z.infer<typeof changePasswordSchema>;
