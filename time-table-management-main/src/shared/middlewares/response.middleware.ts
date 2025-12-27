import { ApiResponse } from "../../utils/apiResponse";

import type { NextFunction, Request, Response } from "express";

export const responseHelperMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /**
   * Sends a success response with the specified status code and message
   * @param responseConfig The response configuration containing message and status code
   * @param data The data to include in the response
   */
  res.sendSuccessResponse = function (responseConfig, data) {
    this.status(responseConfig.code).json(
      ApiResponse.success(responseConfig.message, data)
    );
  };

  /**
   * Sends an error response with the specified status code and message
   * @param responseConfig The response configuration containing message and status code
   * @param errors Optional array of error messages
   */
  res.sendErrorResponse = function (responseConfig, errors = []) {
    this.status(responseConfig.code).json(
      ApiResponse.error(responseConfig.message, errors)
    );
  };

  next();
};
