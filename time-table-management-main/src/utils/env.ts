import { config as envConfig } from "dotenv";

import { Logger } from "./logger";

envConfig(); // Load environment variables from .env file

export function checkEnvVar<T = string>(
  name: string,
  parser?: (value: string) => T,
  panic?: true
): T;
export function checkEnvVar<T = string>(
  name: string,
  parser?: (value: string) => T,
  panic?: false
): T | undefined;
export function checkEnvVar<T = string>(
  name: string,
  parser?: (value: string) => T,
  panic: boolean = true
): T | undefined {
  const envVar = process.env[name];
  if (!envVar) {
    if (panic) {
      Logger.logErrorMessage(
        `Missing required environment variable: ${name}`,
        true
      );
    }
    return undefined;
  }

  return parser ? parser(envVar) : (envVar as T);
}

export const PORT = checkEnvVar("PORT", (value) => parseInt(value));

export const API_VERSION =
  checkEnvVar("API_VERSION", (value) => parseInt(value), false) || 1;

export const DATABASE_URL = checkEnvVar("DATABASE_URL");

export const REDIS_URL = checkEnvVar("REDIS_URL");

export const REDIS_PORT = checkEnvVar("REDIS_PORT", (value) => parseInt(value));
export const REDIS_HOST = checkEnvVar("REDIS_HOST");

export const JWT_SECRET = checkEnvVar("JWT_SECRET");

export const EMAIL_USER = checkEnvVar("EMAIL_USER");
export const EMAIL_PASSWORD = checkEnvVar("EMAIL_PASSWORD");

export const NODE_ENV = checkEnvVar("NODE_ENV");

export const isProduction = NODE_ENV === "production";

export const isDevelopment = NODE_ENV === "development";

export const isTest = NODE_ENV === "test";

export const ENV = {
  PORT,
  API_VERSION,
  DATABASE_URL,

  NODE_ENV,
  isProduction,
  isDevelopment,
  isTest,
};
