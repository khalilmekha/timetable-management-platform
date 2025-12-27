import { StatusCodes } from "http-status-codes";

import type { RouteResponsesConfig } from "../../types/api";

export const UserResponses = {
  getAllUsers: {
    success: {
      message: "Users retrieved successfully",
      code: StatusCodes.OK,
    },
    fail: {
      message: "Failed to retrieve users",
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    },
  },
  getUserById: {
    success: {
      message: "User retrieved successfully",
      code: StatusCodes.OK,
    },
    fail: {
      message: "Failed to retrieve user",
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    },
    notFound: {
      message: "User not found",
      code: StatusCodes.NOT_FOUND,
    },
  },
  createUser: {
    success: {
      message: "User created successfully",
      code: StatusCodes.CREATED,
    },
    fail: {
      message: "Failed to create user",
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    },
  },
  updateUser: {
    success: {
      message: "User updated successfully",
      code: StatusCodes.OK,
    },
    fail: {
      message: "Failed to update user",
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    },
    notFound: {
      message: "User not found",
      code: StatusCodes.NOT_FOUND,
    },
  },
  deleteUser: {
    success: {
      message: "User deleted successfully",
      code: StatusCodes.OK,
    },
    fail: {
      message: "Failed to delete user",
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    },
    notFound: {
      message: "User not found",
      code: StatusCodes.NOT_FOUND,
    },
  },
  changePassword: {
    success: {
      message: "Password changed successfully",
      code: StatusCodes.OK,
    },
    fail: {
      message: "Failed to change password",
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    },
    invalidPassword: {
      message: "Current password is incorrect",
      code: StatusCodes.BAD_REQUEST,
    },
  },
} satisfies RouteResponsesConfig;
