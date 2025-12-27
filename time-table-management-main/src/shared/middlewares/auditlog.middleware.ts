import { AuditlogService } from "../../modules/auditlog/auditlog.service";
import { Logger } from "../../utils/logger";

import type { NextFunction, Request, Response } from "express";

export class AuditLogMiddleware {
  /**
   * Middleware to log requests to audit log
   * Only logs requests from authenticated users
   */
  static auditLogger(req: Request, res: Response, next: NextFunction) {
    // Continue with the request first
    next();

    // Log the request after it's processed (when response is finished)
    res.on("finish", async () => {
      try {
        // Only log requests from authenticated users
        if (req.user?.id) {
          const method = req.method;
          const path = req.originalUrl || req.url;
          const status = res.statusCode;
          const userId = req.user.id;

          console.log("body", req.body);
          //response data


          // Skip logging certain paths to avoid noise
          const skipPaths = [
            "/auth/me", // Skip profile checks
            "/favicon.ico", // Skip favicon requests
          ];

          const shouldSkip = skipPaths.some((skipPath) =>
            path.includes(skipPath)
          );

          if (!shouldSkip) {
            await AuditlogService.createAuditLog(method, path, status, userId);
          }
        }
      } catch (error) {
        // Log error but don't affect the response
        Logger.logError(error);
      }
    });
  }
}
