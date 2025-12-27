import { createClient } from "redis";

import { REDIS_URL } from "@utils/env";
import { Logger } from "@utils/logger";

export const redisClient = createClient({
  url: REDIS_URL,
});

export class CacheDatabaseClient {
  static async connect() {
    try {
      await redisClient.connect();
      Logger.logInfoMessage("Redis connected successfully");
    } catch (error) {
      Logger.logError(error, true);
    }
  }

  static async disconnect() {
    try {
      await redisClient.quit();
      Logger.logInfoMessage("Redis disconnected successfully");
    } catch (error) {
      Logger.logError(error, true);
    }
  }
}
