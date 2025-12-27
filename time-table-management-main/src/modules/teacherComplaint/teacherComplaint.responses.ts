import { StatusCodes } from "http-status-codes";

import type { RouteResponsesConfig } from "../../types/api";

export const TeacherComplaintRouteResponses = {
  create: {
    badRequest: {
      code: StatusCodes.BAD_REQUEST,
      message: "Failed to create teacher complaint",
    },
    success: {
      code: StatusCodes.CREATED,
      message: "Teacher complaint created successfully",
    },
  },

  getAll: {
    success: {
      code: StatusCodes.OK,
      message: "Teacher complaints retrieved successfully",
    },
    error: {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Failed to retrieve teacher complaints",
    },
  },

  getById: {
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Teacher complaint not found",
    },
    success: {
      code: StatusCodes.OK,
      message: "Teacher complaint retrieved successfully",
    },
  },

  getByTeacher: {
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Teacher not found",
    },
    success: {
      code: StatusCodes.OK,
      message: "Teacher complaints retrieved successfully",
    },
    error: {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Failed to retrieve teacher complaints",
    },
  },

  update: {
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Teacher complaint not found",
    },
    success: {
      code: StatusCodes.OK,
      message: "Teacher complaint updated successfully",
    },
    badRequest: {
      code: StatusCodes.BAD_REQUEST,
      message: "Failed to update teacher complaint",
    },
  },

  delete: {
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Teacher complaint not found",
    },
    success: {
      code: StatusCodes.OK,
      message: "Teacher complaint deleted successfully",
    },
  },
} satisfies RouteResponsesConfig;
