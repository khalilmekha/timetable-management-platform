import "./pdf/pdf.service";
import { apiRouterConfig } from "@modules/api";
import { auditlogRouterConfig } from "@modules/auditlog";
import { authRouterConfig } from "@modules/auth";
import { classroomRouterConfig } from "@modules/classroom";
import { courseRouterConfig } from "@modules/course";
import { mainRouterConfig } from "@modules/main";
import { sectionRouterConfig } from "@modules/section";
import { specialityRouterConfig } from "@modules/speciality";
import { teacherComplaintRouterConfig } from "@modules/teacherComplaint";

import { seasonRouterConfig } from "@/modules/season";

import { teacherRouterConfig } from "./teacher";
import { userRouterConfig } from "./user";

import { API_VERSION } from "../utils/env";

import type { Application } from "express";

export function SetupRouters(app: Application) {
  const routers = [
    mainRouterConfig,
    apiRouterConfig,
    authRouterConfig,
    userRouterConfig,
    teacherRouterConfig,
    sectionRouterConfig,
    seasonRouterConfig,
    classroomRouterConfig,
    specialityRouterConfig,
    courseRouterConfig,
    teacherComplaintRouterConfig,
    auditlogRouterConfig,
  ];

  for (const routerConfig of routers) {
    const routerBasePath = routerConfig.apiComponentRouter
      ? `/api/v${API_VERSION}${routerConfig.basePath}`
      : routerConfig.basePath;

    app.use(routerBasePath, routerConfig.router);
  }
}
