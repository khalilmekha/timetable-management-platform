import { StatusCodes } from "http-status-codes";

import type { RouteResponsesConfig } from "../../types/api";

export const AuditlogResponses = {
  getAllAuditlogs: {
    success: {
      message: "Audit logs retrieved successfully",
      code: StatusCodes.OK,
    },
    fail: {
      message: "Failed to retrieve audit logs",
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    },
  },
  getAuditlogById: {
    success: {
      message: "Audit log retrieved successfully",
      code: StatusCodes.OK,
    },
    fail: {
      message: "Failed to retrieve audit log",
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    },
    notFound: {
      message: "Audit log not found",
      code: StatusCodes.NOT_FOUND,
    },
  },
} satisfies RouteResponsesConfig;
