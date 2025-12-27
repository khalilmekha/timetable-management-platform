import { prismaClient } from "../../database/prisma";
import { ServiceResponse } from "../../utils/serviceResponse";

export class AuditlogService {
  /**
   * Get all audit logs
   * @returns ServiceResponse with all audit logs
   */
  static async getAllAuditlogs() {
    try {
      const auditlogs = await prismaClient.auditLog.findMany({
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return ServiceResponse.success(
        "Audit logs retrieved successfully",
        auditlogs
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to retrieve audit logs", [error]);
    }
  }

  /**
   * Get audit log by ID
   * @param auditlogId - The ID of the audit log to retrieve
   * @returns ServiceResponse with the audit log
   */
  static async getAuditlogById(auditlogId: string) {
    try {
      const auditlog = await prismaClient.auditLog.findUnique({
        where: {
          id: auditlogId,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
        },
      });

      if (!auditlog) {
        return ServiceResponse.fail("Audit log not found");
      }

      return ServiceResponse.success(
        "Audit log retrieved successfully",
        auditlog
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to retrieve audit log", [error]);
    }
  }

  /**
   * Create a new audit log entry
   * @param method - HTTP method (GET, POST, etc.)
   * @param path - Request path
   * @param status - HTTP status code
   * @param userId - ID of the user making the request
   * @returns ServiceResponse with the created audit log
   */
  static async createAuditLog(
    method: string,
    path: string,
    status: number,
    userId: string
  ) {
    try {
      const auditlog = await prismaClient.auditLog.create({
        data: {
          method,
          path,
          status,
          userId,
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              role: true,
            },
          },
        },
      });

      return ServiceResponse.success(
        "Audit log created successfully",
        auditlog
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to create audit log", [error]);
    }
  }
}
