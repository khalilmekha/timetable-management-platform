/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Request } from "express";
import type { ParamsDictionary, Query } from "express-serve-static-core";
import type {
  z,
  ZodEffects,
  ZodError,
  ZodSchema,
  ZodType,
  ZodTypeDef,
} from "zod";

export declare type RequestValidation<TParams, TQuery, TBody> = {
  params?: ZodSchema<TParams>;
  query?: ZodSchema<TQuery>;
  body?: ZodSchema<TBody>;
};
export declare type RequestProcessing<TParams, TQuery, TBody> = {
  params?: ZodEffects<any, TParams>;
  query?: ZodEffects<any, TQuery>;
  body?: ZodEffects<any, TBody>;
};

export declare type TypedRequest<
  TParams extends ZodType<any, ZodTypeDef, any>,
  TQuery extends ZodType<any, ZodTypeDef, any>,
  TBody extends ZodType<any, ZodTypeDef, any>,
> = Request<z.infer<TParams>, any, z.infer<TBody>, z.infer<TQuery>>;

export declare type TypedRequestBody<
  TBody extends ZodType<any, ZodTypeDef, any>,
> = Request<ParamsDictionary, any, z.infer<TBody>, any>;

export declare type TypedRequestParams<
  TParams extends ZodType<any, ZodTypeDef, any>,
> = Request<z.infer<TParams>, any, any, Query>;

export declare type TypedRequestQuery<
  TQuery extends ZodType<any, ZodTypeDef, any>,
> = Request<ParamsDictionary, any, any, z.infer<TQuery>>;

export declare type ConvertToType<T, J> = {
  [K in keyof T]: J;
};

export declare type TransformResult<
  T,
  Transform extends boolean,
> = Transform extends true ? T : ConvertToType<T, string>;
export declare type SchemaConfig<Tparams, Tquery, Tbody> = {
  bodySchema?: ZodEffects<any, Tbody> | ZodSchema<Tbody>;
  querySchema?: ZodEffects<any, Tquery> | ZodSchema<Tquery>;
  paramsSchema?: ZodEffects<any, Tparams> | ZodSchema<Tparams>;
};
export declare type RequestPart = "body" | "query" | "params";

export declare type ErrorListItem = {
  type: "Query" | "Params" | "Body";
  errors: ZodError<any>;
};
