import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import http from "node:http";

import { corsOptions } from "./configs/cors";
import { helmetOptions } from "./configs/helmet";
import { DatabaseClient } from "./database/prisma";
import { CacheDatabaseClient } from "./database/redis";
import { SetupRouters } from "./modules";
import { AuditLogMiddleware } from "./shared/middlewares/auditlog.middleware";
import { ErrorMiddleware } from "./shared/middlewares/error.middleware";
import { responseHelperMiddleware } from "./shared/middlewares/response.middleware";
import { isProduction, PORT } from "./utils/env";
import { Logger } from "./utils/logger";

export const app = express();
export const httpServer = http.createServer(app); // Create HTTP server

app.use(morgan(isProduction ? "combined" : "dev")); // Logging

app.use(cors(corsOptions)); // CORS

app.use(helmet(helmetOptions)); // Security

app.use(express.json()); // Body parser for JSON

app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded

app.use(responseHelperMiddleware);

app.use(AuditLogMiddleware.auditLogger); // Audit logging

SetupRouters(app); // Setup routers

app.use(ErrorMiddleware.notFound); // 404 handler
app.use(ErrorMiddleware.internalServerError); // 500 handler

process.on("unhandledRejection", Logger.logError);
process.on("uncaughtException", Logger.logError);

export class Server {
  static httpServer = httpServer; // Export the HTTP server
  static app = app; // Export the Express app

  static async start() {
    try {
    //  await DatabaseClient.connect(); // Connect to the database
      await CacheDatabaseClient.connect(); // Connect to the Redis database
      httpServer.listen(PORT, () => {
        console.log();
        Logger.logInfoMessage(`Server is running http://localhost:${PORT}`);
        Logger.logInfoMessage(
          `Environment: ${isProduction ? "Production" : "Development"}`
        );
      });
    } catch (error) {
      Logger.logError(error, true); // Log error and exit process
    }
  }

  static async stop() {
    try {
   //   await DatabaseClient.disconnect(); // Disconnect from the database
       await CacheDatabaseClient.disconnect(); // Disconnect from the Redis database
      httpServer.close(() => {
        Logger.logInfoMessage("Server stopped successfully");
      });
    } catch (error) {
      Logger.logError(error, true); // Log error and exit process
    }
  }
}
