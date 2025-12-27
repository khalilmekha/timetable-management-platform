/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";

import { ApiResponse } from "../../utils/apiResponse";

import type { RequestHandler, Response } from "express";
import type { ParamsDictionary, Query } from "express-serve-static-core";
import type {
  ErrorListItem,
  SchemaConfig,
  TransformResult,
} from "../../types/zodValidation";

export class ValidationMiddleware {
  private static sendValidationErrors(
    errors: Array<ErrorListItem>,
    res: Response
  ): void {
    const validationErrors = errors
      .map((error) => {
        return error.errors.errors.map((err) => {
          if (err.path.length === 0) {
            return `${error.type}: ${err.message}`;
          } else {
            return `${error.type}[${err.path}] : ${err.message}`;
          }
        });
      })
      .flat();

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(ApiResponse.error("Validation failed", validationErrors));
  }

  static validate<Tbody = any, Tquery = Query, Tparams = ParamsDictionary>(
    config: SchemaConfig<Tparams, Tquery, Tbody>,
    transform?: false
  ): RequestHandler<TransformResult<Tparams, false>, any, any, Query>;
  static validate<Tbody = any, Tquery = Query, Tparams = ParamsDictionary>(
    config: SchemaConfig<Tbody, Tquery, Tparams>,
    transform?: true
  ): RequestHandler<Tparams, any, Tbody, Tquery>;

  static validate<Tparams = ParamsDictionary, Tquery = Query, Tbody = any>(
    config: SchemaConfig<Tparams, Tquery, Tbody>,
    transform: boolean = false
  ): RequestHandler<Tparams, any, Tbody, Tquery> {
    const { bodySchema, querySchema, paramsSchema } = config;

    return (req, res, next) => {
      const errors: Array<ErrorListItem> = [];
      if (bodySchema) {
        const bodyParsed = bodySchema.safeParse(req.body);
        if (!bodyParsed.success) {
          errors.push({
            type: "Body",
            errors: bodyParsed.error,
          });
        } else if (transform) {
          req.body = bodyParsed.data;
        }
      }

      if (querySchema) {
        const queryParsed = querySchema.safeParse(req.query);

        if (!queryParsed.success) {
          errors.push({
            type: "Query",
            errors: queryParsed.error,
          });
        } else if (transform) {
          Object.defineProperty(req, "query", {
            value: queryParsed.data,
            writable: true,
            configurable: true,
          }); // must be done this way because query is readonly in express
        }
      }
      if (paramsSchema) {
        const paramsParsed = paramsSchema.safeParse(req.params);
        if (!paramsParsed.success) {
          errors.push({
            type: "Params",
            errors: paramsParsed.error,
          });
        } else if (transform) {
          req.params = paramsParsed.data;
        }
      }

      if (errors.length > 0) {
        ValidationMiddleware.sendValidationErrors(errors, res);
        return;
      }

      next();
    };
  }

  static validateBody<Tbody = any>(
    schema: SchemaConfig<any, any, Tbody>["bodySchema"]
  ): RequestHandler<any, any, Tbody> {
    return this.validate({ bodySchema: schema }, true);
  }

  static validateQuery<Tquery = Query>(
    schema: SchemaConfig<any, Tquery, any>["querySchema"]
  ): RequestHandler<any, any, any, Tquery> {
    return this.validate({ querySchema: schema }, true);
  }

  static validateParams<Tparams = ParamsDictionary>(
    schema: SchemaConfig<Tparams, any, any>["paramsSchema"]
  ): RequestHandler<Tparams, any, any, any> {
    return this.validate({ paramsSchema: schema }, true);
  }
}
