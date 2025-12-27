import { StatusCodes } from "http-status-codes";

import { ApiResponse } from "../../utils/apiResponse";

import type { NextFunction, Request, Response } from "express";

export class ErrorMiddleware {
  static notFound(req: Request, res: Response) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json(ApiResponse.error("Route Not found"));
  }

  static internalServerError(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.error(err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(ApiResponse.error("Internal server error"));
  }
}
