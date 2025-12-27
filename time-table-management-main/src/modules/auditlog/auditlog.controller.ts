import { AuditlogResponses } from "./auditlog.responses";
import { AuditlogService } from "./auditlog.service";

import type { Request, Response } from "express";
import type { AuditlogIdParamSchemaType } from "./auditlog.validation";

export class AuditlogController {
  /**
   * Get all audit logs
   */
  static async getAllAuditlogs(req: Request, res: Response) {
    const result = await AuditlogService.getAllAuditlogs();

    if (!result.success) {
      res.sendErrorResponse(
        AuditlogResponses.getAllAuditlogs.fail,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      AuditlogResponses.getAllAuditlogs.success,
      result.data
    );
  }

  /**
   * Get audit log by ID
   */
  static async getAuditlogById(req: Request, res: Response) {
    const { auditlogId } = req.params as AuditlogIdParamSchemaType;

    const result = await AuditlogService.getAuditlogById(auditlogId);

    if (!result.success) {
      res.sendErrorResponse(
        AuditlogResponses.getAuditlogById.notFound,
        result.errors
      );
      return;
    }

    res.sendSuccessResponse(
      AuditlogResponses.getAuditlogById.success,
      result.data
    );
  }
}
