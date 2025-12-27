import { $Enums, PrismaClient } from "@prisma/client";

import { DATABASE_URL } from "../utils/env";
import { Logger } from "../utils/logger";

export const prismaClient = new PrismaClient({
  //log: ["query", "info", "warn", "error"],
  errorFormat: "minimal",
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

export const DatabaseEnums = {
  ...$Enums,
};

export class DatabaseClient {
  static async connect() {
    try {
      await prismaClient.$connect();
      Logger.logInfoMessage("Database connected successfully");
    } catch (error) {
      Logger.logError(error, true);
    }
  }

  static async disconnect() {
    try {
      await prismaClient.$disconnect();
      Logger.logInfoMessage("Database disconnected successfully");
    } catch (error) {
      Logger.logError(error, true);
    }
  }
}
