import { StatusCodes } from "http-status-codes";

import type { RouteResponsesConfig } from "../../types/api";

export const CourseRouteResponses = {
  create: {
    badRequest: {
      code: StatusCodes.BAD_REQUEST,
      message: "Failed to create course",
    },
    success: {
      code: StatusCodes.CREATED,
      message: "Course created successfully",
    },
  },

  getAll: {
    success: {
      code: StatusCodes.OK,
      message: "Courses retrieved successfully",
    },
    error: {
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: "Failed to retrieve courses",
    },
  },

  getById: {
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Course not found",
    },
    success: {
      code: StatusCodes.OK,
      message: "Course retrieved successfully",
    },
  },

  update: {
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Course not found",
    },
    success: {
      code: StatusCodes.OK,
      message: "Course updated successfully",
    },
    badRequest: {
      code: StatusCodes.BAD_REQUEST,
      message: "Failed to update course",
    },
  },

  delete: {
    notFound: {
      code: StatusCodes.NOT_FOUND,
      message: "Course not found",
    },
    badRequest: {
      code: StatusCodes.BAD_REQUEST,
      message: "Cannot delete course with associated assignments",
    },
    success: {
      code: StatusCodes.OK,
      message: "Course deleted successfully",
    },
  },
} satisfies RouteResponsesConfig;
