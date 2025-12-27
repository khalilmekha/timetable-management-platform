import { Router } from "express";

import { AuditlogController } from "./auditlog.controller";
import { auditlogIdParamSchema } from "./auditlog.validation";

import { AuthMiddleware } from "../../shared/middlewares/auth.middleware";
import { ValidationMiddleware } from "../../shared/middlewares/validation.middleware";

import type { ModuleRouterConfig } from "../../types/api";

const auditlogRouter = Router();

// Apply authentication middleware for admin only - audit logs are sensitive data
auditlogRouter.use(
  AuthMiddleware.isAuthenticated,
  AuthMiddleware.isAdministrator
);

// GET /api/auditlog - Get all audit logs
auditlogRouter.get("/", AuditlogController.getAllAuditlogs);

// GET /api/auditlog/:auditlogId - Get audit log by ID
auditlogRouter.get(
  "/:auditlogId",
  ValidationMiddleware.validateParams(auditlogIdParamSchema),
  AuditlogController.getAuditlogById
);

export const auditlogRouterConfig: ModuleRouterConfig = {
  router: auditlogRouter,
  basePath: "/auditlog",
  apiComponentRouter: true,
};
