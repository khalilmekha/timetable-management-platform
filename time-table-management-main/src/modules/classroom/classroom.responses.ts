import { StatusCodes } from "http-status-codes";

import type { RouteResponsesConfig } from "../../types/api";

export const ClassroomRouteResponses = {
  create: {
    badRequest: {
      code: StatusCodes.BAD_REQUEST,
      message: "Failed to create classroom",
    },
    success: {
      code: StatusCodes.CREATED,
      message: "Classroom created successfully",
    },
  },

  getAll: {
    success: {
      code: StatusCodes.OK,
      message: "Classrooms retrieved successfully",
    },
    error: {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Failed to retrieve classrooms",
    },
  },

  getById: {
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Classroom not found",
    },
    success: {
      code: StatusCodes.OK,
      message: "Classroom retrieved successfully",
    },
  },

  update: {
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Classroom not found",
    },
    success: {
      code: StatusCodes.OK,
      message: "Classroom updated successfully",
    },
    badRequest: {
      code: StatusCodes.BAD_REQUEST,
      message: "Failed to update classroom",
    },
  },

  delete: {
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Classroom not found",
    },
    badRequest: {
      code: StatusCodes.BAD_REQUEST,
      message: "Cannot delete classroom with associated schedules",
    },
    success: {
      code: StatusCodes.OK,
      message: "Classroom deleted successfully",
    },
  },

  getAvailableClassrooms: {
    success: {
      code: StatusCodes.OK,
      message: "Available classrooms retrieved successfully",
    },
    error: {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Failed to retrieve available classrooms",
    },
  },
} satisfies RouteResponsesConfig;
