import { DatabaseEnums, prismaClient } from "@database/prisma";
import { HashUtils } from "@utils/hash";
import { JWTUtils } from "@utils/jwt";
import { ServiceResponse } from "@utils/serviceResponse";

import type { User } from "@prisma/client";

export class AuthService {
  static optimiseUser(user: User) {
    const { hashedPassword, ...optimisedUser } = user;
    return optimisedUser;
  }

  static async login(email: string, password: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        email,
      },
      include: {
        teacher: true,
      },
    });

    if (!user) {
      return ServiceResponse.fail("User not found");
    }

    const isPasswordValid = await HashUtils.compare(
      password,
      user.hashedPassword
    );

    if (!isPasswordValid) {
      return ServiceResponse.fail("Invalid password");
    }

    const token = JWTUtils.signUserToken(user.id);

    return ServiceResponse.success("Login successful", {
      user: this.optimiseUser(user),
      token,
    });
  }

  static async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    const existingUser = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return ServiceResponse.fail("User already exists");
    }

    const hashedPassword = await HashUtils.hash(password);

    const user = await prismaClient.user
      .create({
        data: {
          email,
          hashedPassword,
          firstName,
          lastName,
          role: DatabaseEnums.UserRole.Teacher,
        },
      })
      .catch((err) => null);

    if (!user) {
      return ServiceResponse.fail("Error creating user");
    }

    const token = JWTUtils.signUserToken(user.id);

    return ServiceResponse.success("Registration successful", {
      user: this.optimiseUser(user),
      token,
    });
  }

  static async updateProfile(
    id: string,
    firstName?: string,
    lastName?: string
  ) {
    const user = await prismaClient.user.update({
      where: {
        id,
      },
      data: {
        firstName,
        lastName,
      },
    });

    if (!user) {
      return ServiceResponse.fail("Error updating user");
    }

    return ServiceResponse.success(
      "User updated successfully",
      this.optimiseUser(user)
    );
  }
}
