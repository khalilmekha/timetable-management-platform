import { StatusCodes } from "http-status-codes";

import type { RouteResponsesConfig } from "../../types/api";

export const SpecialityRouteResponses = {
  create: {
    badRequest: {
      code: StatusCodes.BAD_REQUEST,
      message: "Failed to create speciality",
    },
    success: {
      code: StatusCodes.CREATED,
      message: "Speciality created successfully",
    },
  },

  getAll: {
    success: {
      code: StatusCodes.OK,
      message: "Specialities retrieved successfully",
    },
    error: {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Failed to retrieve specialities",
    },
  },

  getById: {
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Speciality not found",
    },
    success: {
      code: StatusCodes.OK,
      message: "Speciality retrieved successfully",
    },
  },

  update: {
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Speciality not found",
    },
    success: {
      code: StatusCodes.OK,
      message: "Speciality updated successfully",
    },
    badRequest: {
      code: StatusCodes.BAD_REQUEST,
      message: "Failed to update speciality",
    },
  },

  delete: {
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Speciality not found",
    },
    badRequest: {
      code: StatusCodes.BAD_REQUEST,
      message: "Cannot delete speciality with associated sections or courses",
    },
    success: {
      code: StatusCodes.OK,
      message: "Speciality deleted successfully",
    },
  },
} satisfies RouteResponsesConfig;
