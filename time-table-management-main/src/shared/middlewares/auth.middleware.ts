import { DatabaseEnums } from "../../database/prisma";
import { UserService } from "../../modules/user/user.service";
import { ApiResponse } from "../../utils/apiResponse";
import { JWTUtils } from "../../utils/jwt";
import { AuthMiddlewareResponses } from "../constants/middlwares.responses";

import type { NextFunction, Request, Response } from "express";

export class AuthMiddleware {
  static async isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const authorizationHeader = req.headers["authorization"]?.trim() ?? null;
    if (!authorizationHeader) {
      const noAuthorizationHeaderResponse =
        AuthMiddlewareResponses.noAuthorizationHeader;

      res
        .status(noAuthorizationHeaderResponse.code)
        .json(ApiResponse.error(noAuthorizationHeaderResponse.message));
      return;
    }

    const authorizationHeaderRegex = /^Bearer\s(?<token>\S+)$/;

    const match = authorizationHeader.match(authorizationHeaderRegex);
    const token = match?.groups?.token ?? null;

    if (!token) {
      const authorizationHeaderMalformedResponse =
        AuthMiddlewareResponses.authorizationHeaderMalformed;

      res
        .status(authorizationHeaderMalformedResponse.code)
        .json(ApiResponse.error(authorizationHeaderMalformedResponse.message));
      return;
    }

    const userId = JWTUtils.verifyToken(token);

    if (!userId) {
      const invalidTokenResponse = AuthMiddlewareResponses.invalidToken;

      res
        .status(invalidTokenResponse.code)
        .json(ApiResponse.error(invalidTokenResponse.message));
      return;
    }

    const user = await UserService.getUserById(userId);

    if (!user.success) {
      const userNotFoundResponse = AuthMiddlewareResponses.userNotFound;

      res
        .status(userNotFoundResponse.code)
        .json(ApiResponse.error(userNotFoundResponse.message));
      return;
    }

    req.user = user.data;

    // If token is valid, proceed to the next middleware or route handler
    next();
  }

  static async isAdministrator(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user = req.user;

    if (!user) {
      const userNotLoggedInResponse = AuthMiddlewareResponses.userNotLoggedIn;

      res
        .status(userNotLoggedInResponse.code)
        .json(ApiResponse.error(userNotLoggedInResponse.message));
      return;
    }

    if (user.role !== DatabaseEnums.UserRole.Administrator) {
      const userIsNotAdminResponse =
        AuthMiddlewareResponses.userIsNotAdministrator;

      res
        .status(userIsNotAdminResponse.code)
        .json(ApiResponse.error(userIsNotAdminResponse.message));
      return;
    }

    next();
  }
  static async isTeacher(req: Request, res: Response, next: NextFunction) {
    const user = req.user;

    if (!user) {
      const userNotLoggedInResponse = AuthMiddlewareResponses.userNotLoggedIn;

      res
        .status(userNotLoggedInResponse.code)
        .json(ApiResponse.error(userNotLoggedInResponse.message));
      return;
    }

    if (user.role !== DatabaseEnums.UserRole.Teacher) {
      const userIsNotTeacherResponse = AuthMiddlewareResponses.userIsNotTeacher;

      res
        .status(userIsNotTeacherResponse.code)
        .json(ApiResponse.error(userIsNotTeacherResponse.message));
      return;
    }

    const teacher = user.teacher;

    if (!teacher) {
      const userHasNoTeacherAssociationResponse =
        AuthMiddlewareResponses.userHasNoTeacherAssociation;

      res
        .status(userHasNoTeacherAssociationResponse.code)
        .json(ApiResponse.error(userHasNoTeacherAssociationResponse.message));
      return;
    }

    next();
  }

  static async isTeacherOrAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const user = req.user;

    if (!user) {
      const userNotLoggedInResponse = AuthMiddlewareResponses.userNotLoggedIn;

      res
        .status(userNotLoggedInResponse.code)
        .json(ApiResponse.error(userNotLoggedInResponse.message));
      return;
    }

    // Allow if user is administrator
    if (user.role === DatabaseEnums.UserRole.Administrator) {
      return next();
    }

    // Check if user is a teacher
    if (user.role !== DatabaseEnums.UserRole.Teacher) {
      const userIsNotTeacherOrAdminResponse =
        AuthMiddlewareResponses.userIsNotTeacher;

      res
        .status(userIsNotTeacherOrAdminResponse.code)
        .json(ApiResponse.error("User must be a teacher or administrator"));
      return;
    }

    // Ensure teacher has associated teacher record
    const teacher = user.teacher;
    if (!teacher) {
      const userHasNoTeacherAssociationResponse =
        AuthMiddlewareResponses.userHasNoTeacherAssociation;

      res
        .status(userHasNoTeacherAssociationResponse.code)
        .json(ApiResponse.error(userHasNoTeacherAssociationResponse.message));
      return;
    }

    next();
  }
}
