import { DatabaseEnums, prismaClient } from "../../database/prisma";
import { HashUtils } from "../../utils/hash";
import { ServiceResponse } from "../../utils/serviceResponse";

import type { Teacher, User } from "@prisma/client";
import type { OptimizedUser } from "../../types/data";
import type {
  CreateUserSchemaType,
  UpdateUserSchemaType,
} from "./user.validation";

export class UserService {
  /**
   * Optimizes user object by removing sensitive data
   * @param user User object to optimize
   * @returns Optimized user object
   */
  static optimizeUser(user: User & { teacher: Teacher | null }): OptimizedUser {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hashedPassword, ...userData } = user;

    return {
      ...userData,
      hashedPassword: null,
      // Ensure teacher is included if exists
    };
  }

  /**
   * Get all users
   * @returns ServiceResponse with all users
   */
  static async getAllUsers() {
    try {
      const users = await prismaClient.user.findMany({
        include: {
          teacher: true,
        },
      });

      const optimizedUsers = users.map((user) => this.optimizeUser(user));

      return ServiceResponse.success(
        "Users retrieved successfully",
        optimizedUsers
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to retrieve users", [error]);
    }
  }

  /**
   * Get user by ID
   * @param userId ID of the user to retrieve
   * @returns ServiceResponse with the user
   */
  static async getUserById(userId: string) {
    try {
      const user = await prismaClient.user.findUnique({
        where: { id: userId },
        include: {
          teacher: true,
        },
      });

      if (!user) {
        return ServiceResponse.fail("User not found");
      }

      return ServiceResponse.success(
        "User retrieved successfully",
        this.optimizeUser(user)
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to retrieve user", [error]);
    }
  }

  /**
   * Create a new user
   * @param userData User data for creation
   * @returns ServiceResponse with the created user
   */
  static async createUser(userData: CreateUserSchemaType) {
    try {
      // Check if email already exists
      const existingUser = await prismaClient.user.findUnique({
        where: { email: userData.email },
      });

      if (existingUser) {
        return ServiceResponse.fail("Email already in use");
      }

      // Hash the password
      const hashedPassword = await HashUtils.hash(userData.password);

      // Create the user
      const user = await prismaClient.user.create({
        data: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          hashedPassword,
          role: userData.role || DatabaseEnums.UserRole.Teacher,
        },
        include: {
          teacher: true,
        },
      });

      return ServiceResponse.success(
        "User created successfully",
        this.optimizeUser(user)
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to create user", [error]);
    }
  }

  /**
   * Update an existing user
   * @param userId ID of the user to update
   * @param updateData Data to update
   * @returns ServiceResponse with the updated user
   */
  static async updateUser(userId: string, updateData: UpdateUserSchemaType) {
    try {
      // Check if user exists
      const existingUser = await prismaClient.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return ServiceResponse.fail("User not found");
      }

      // Check if email is being updated and is not already in use
      if (updateData.email && updateData.email !== existingUser.email) {
        const emailInUse = await prismaClient.user.findUnique({
          where: { email: updateData.email },
        });

        if (emailInUse) {
          return ServiceResponse.fail("Email already in use");
        }
      }

      // Update the user
      const updatedUser = await prismaClient.user.update({
        where: { id: userId },
        data: updateData,
        include: {
          teacher: true,
        },
      });


      return ServiceResponse.success(
        "User updated successfully",
        this.optimizeUser(updatedUser)
      );
    } catch (error) {
      return ServiceResponse.fail("Failed to update user", [error]);
    }
  }

  /**
   * Delete a user
   * @param userId ID of the user to delete
   * @returns ServiceResponse indicating success or failure
   */
  static async deleteUser(userId: string) {
    try {
      // Check if user exists
      const existingUser = await prismaClient.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return ServiceResponse.fail("User not found");
      }

      // Delete the user
      await prismaClient.user.delete({
        where: { id: userId },
      });


      return ServiceResponse.success("User deleted successfully", null);
    } catch (error) {
      return ServiceResponse.fail("Failed to delete user", [error]);
    }
  }

  /**
   * Change user password
   * @param userId ID of the user
   * @param currentPassword Current password for verification
   * @param newPassword New password to set
   * @returns ServiceResponse indicating success or failure
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    try {
      // Check if user exists
      const user = await prismaClient.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return ServiceResponse.fail("User not found");
      }

      // Verify current password
      const isPasswordValid = await HashUtils.compare(
        currentPassword,
        user.hashedPassword
      );

      if (!isPasswordValid) {
        return ServiceResponse.fail("Current password is incorrect");
      }

      // Hash the new password
      const hashedPassword = await HashUtils.hash(newPassword);

      // Update the password
      await prismaClient.user.update({
        where: { id: userId },
        data: { hashedPassword },
      });


      return ServiceResponse.success("Password changed successfully", null);
    } catch (error) {
      return ServiceResponse.fail("Failed to change password", [error]);
    }
  }
}
