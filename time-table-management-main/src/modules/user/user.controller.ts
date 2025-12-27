import { UserResponses } from "./user.responses";
import { UserService } from "./user.service";

import type { Request, Response } from "express";
import type {
  ChangePasswordSchemaType,
  CreateUserSchemaType,
  UpdateUserSchemaType,
} from "./user.validation";

export class UserController {
  /**
   * Get all users
   */
  static async getAllUsers(req: Request, res: Response) {
    const result = await UserService.getAllUsers();
    if (!result.success) {
      res.sendErrorResponse(UserResponses.getAllUsers.fail, result.errors);
      return;
    }

    res.sendSuccessResponse(UserResponses.getAllUsers.success, result.data);
  }
  /**
   * Get user by ID
   */
  static async getUserById(req: Request, res: Response) {
    const { userId } = req.params;

    const result = await UserService.getUserById(userId);

    if (!result.success) {
      if (result.errors?.[0] === "User not found") {
        res.sendErrorResponse(UserResponses.getUserById.notFound);
        return;
      }

      res.sendErrorResponse(UserResponses.getUserById.fail, result.errors);
      return;
    }

    res.sendSuccessResponse(UserResponses.getUserById.success, result.data);
  }

  /**
   * Create a new user
   */
  static async createUser(req: Request, res: Response) {
    const userData = req.body as CreateUserSchemaType;

    const result = await UserService.createUser(userData);

    if (!result.success) {
      res.sendErrorResponse(UserResponses.createUser.fail, result.errors);
      return;
    }

    res.sendSuccessResponse(UserResponses.createUser.success, result.data);
  }
  /**
   * Update an existing user
   */
  static async updateUser(req: Request, res: Response) {
    const { userId } = req.params;
    const updateData = req.body as UpdateUserSchemaType;

    const result = await UserService.updateUser(userId, updateData);

    if (!result.success) {
      if (result.errors?.[0] === "User not found") {
        res.sendErrorResponse(UserResponses.updateUser.notFound);
        return;
      }

      res.sendErrorResponse(UserResponses.updateUser.fail, result.errors);
      return;
    }

    res.sendSuccessResponse(UserResponses.updateUser.success, result.data);
  }
  /**
   * Delete a user
   */
  static async deleteUser(req: Request, res: Response) {
    const { userId } = req.params;

    const result = await UserService.deleteUser(userId);

    if (!result.success) {
      if (result.errors?.[0] === "User not found") {
        res.sendErrorResponse(UserResponses.deleteUser.notFound);
        return;
      }

      res.sendErrorResponse(UserResponses.deleteUser.fail, result.errors);
      return;
    }

    res.sendSuccessResponse(UserResponses.deleteUser.success, null);
  }
  /**
   * Change password for a user
   */
  static async changePassword(req: Request, res: Response) {
    const { userId } = req.params;
    const { currentPassword, newPassword } =
      req.body as ChangePasswordSchemaType;

    const result = await UserService.changePassword(
      userId,
      currentPassword,
      newPassword
    );

    if (!result.success) {
      if (result.errors?.[0] === "Current password is incorrect") {
        res.sendErrorResponse(UserResponses.changePassword.invalidPassword);
        return;
      }

      if (result.errors?.[0] === "User not found") {
        res.sendErrorResponse(UserResponses.getUserById.notFound);
        return;
      }

      res.sendErrorResponse(UserResponses.changePassword.fail, result.errors);
      return;
    }

    res.sendSuccessResponse(UserResponses.changePassword.success, null);
  }
}
