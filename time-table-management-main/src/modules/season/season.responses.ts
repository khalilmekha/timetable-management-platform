import { StatusCodes } from "http-status-codes";

import type { RouteResponsesConfig } from "../../types/api";

export const SeasonRouteResponses = {
  create: {
    badRequest: {
      code: StatusCodes.BAD_REQUEST,
      message: "Failed to create Season",
    },
    success: {
      code: StatusCodes.CREATED,
      message: "Season created successfully",
    },
  },

  getAll: {
    success: {
      code: StatusCodes.OK,
      message: "Seasons retrieved successfully",
    },
    error: {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Failed to retrieve Seasons",
    },
  },

  getById: {
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Season not found",
    },
    success: {
      code: StatusCodes.OK,
      message: "Season retrieved successfully",
    },
  },

  update: {
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Season not found",
    },
    success: {
      code: StatusCodes.OK,
      message: "Season updated successfully",
    },
    badRequest: {
      code: StatusCodes.BAD_REQUEST,
      message: "Failed to update Season",
    },
  },

  delete: {
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Season not found",
    },
    badRequest: {
      code: StatusCodes.BAD_REQUEST,
      message: "Cannot delete Season with associated specialities",
    },
    success: {
      code: StatusCodes.OK,
      message: "Season deleted successfully",
    },
  },
} satisfies RouteResponsesConfig;
