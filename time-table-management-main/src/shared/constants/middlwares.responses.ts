import { StatusCodes } from "http-status-codes";

import type { RouteResponsesConfig } from "../../types/api";

export const AuthMiddlewareResponses = {
  noAuthorizationHeader: {
    message: "No authorization header provided",
    code: StatusCodes.UNAUTHORIZED,
  },

  authorizationHeaderMalformed: {
    message: "Authorization header malformed, Expected format 'Bearer <token>'",
    code: StatusCodes.UNAUTHORIZED,
  },

  invalidToken: {
    message: "Invalid token",
    code: StatusCodes.UNAUTHORIZED,
  },

  userNotFound: {
    message: "User not found",
    code: StatusCodes.UNAUTHORIZED,
  },

  userNotLoggedIn: {
    message: "User not logged in",
    code: StatusCodes.UNAUTHORIZED,
  },

  userIsNotAdministrator: {
    message: "User is not admin",
    code: StatusCodes.FORBIDDEN,
  },

  userIsNotTeacher: {
    message: "User is not teacher",
    code: StatusCodes.FORBIDDEN,
  },

  userHasNoTeacherAssociation: {
    message: "User has no teacher association",
    code: StatusCodes.FORBIDDEN,
  },
} satisfies RouteResponsesConfig;
