import { StatusCodes } from "http-status-codes";

import type { RouteResponsesConfig } from "../../types/api";

export const AuthResponses = {
  login: {
    success: {
      message: "Login successful",
      code: StatusCodes.OK,
    },

    failed: {
      message: "Login failed",
      code: StatusCodes.UNAUTHORIZED,
    },
  },

  register: {
    success: {
      message: "Registration successful",
      code: StatusCodes.CREATED,
    },

    failed: {
      message: "Registration failed",
      code: StatusCodes.BAD_REQUEST,
    },
  },

  updateProfile: {
    success: {
      message: "Update successful",
      code: StatusCodes.OK,
    },

    failed: {
      message: "Update failed",
      code: StatusCodes.BAD_REQUEST,
    },
  },

  myProfile: {
    success: {
      message: "Profile retrieved successfully",
      code: StatusCodes.OK,
    },

    failed: {
      message: "Failed to retrieve profile",
      code: StatusCodes.BAD_REQUEST,
    },
  },
} satisfies RouteResponsesConfig;
