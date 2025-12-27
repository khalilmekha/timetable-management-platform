import z from "zod";

export const auditlogIdParamSchema = z.object({
  auditlogId: z.string().uuid(),
});

export type AuditlogIdParamSchemaType = z.infer<typeof auditlogIdParamSchema>;
