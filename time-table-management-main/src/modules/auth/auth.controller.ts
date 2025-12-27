import { AuthResponses } from "./auth.responses";
import { AuthService } from "./auth.service";

import { TeacherService } from "../teacher/teacher.service";

import type { Request, Response } from "express";
import type { LoginSchemaType, UpdateUserSchemaType } from "./auth.validation";

export class AuthController {
  static async login(req: Request, res: Response) {
    const { email, password } = req.body as LoginSchemaType;

    const serviceResponse = await AuthService.login(email, password);

    if (!serviceResponse.success) {
      res.sendErrorResponse(AuthResponses.login.failed, serviceResponse.errors);
      return;
    }

    res.sendSuccessResponse(AuthResponses.login.success, serviceResponse.data);
  }
  static async updateProfile(req: Request, res: Response) {
    const { firstName, lastName } = req.body as UpdateUserSchemaType;

    if (!req.user) return;

    if (!firstName && !lastName) {
      res.sendErrorResponse(AuthResponses.updateProfile.failed, []);
      return;
    }

    const serviceResponse = await AuthService.updateProfile(
      req.user.id,
      firstName,
      lastName
    );

    if (!serviceResponse.success) {
      res.sendErrorResponse(
        AuthResponses.updateProfile.failed,
        serviceResponse.errors
      );
      return;
    }

    res.sendSuccessResponse(
      AuthResponses.updateProfile.success,
      serviceResponse.data
    );
  }
  static async getMyProfile(req: Request, res: Response) {
    if (!req.user) return;

    const user = req.user;

    res.sendSuccessResponse(AuthResponses.myProfile.success, user);
  }
  static async getMyTeacherSchedule(req: Request, res: Response) {
    if (!req.user || !req.user.teacher) return;

    const teacherId = req.user.teacher.id;

    const serviceResponse = await TeacherService.getTeacherScheduleById(
      teacherId,
      "First"
    );

    if (!serviceResponse.success) {
      res.sendErrorResponse(
        AuthResponses.myProfile.failed,
        serviceResponse.errors
      );
      return;
    }

    res.sendSuccessResponse(
      AuthResponses.myProfile.success,
      serviceResponse.data
    );
  } /*
  static async register(req: Request, res: Response) {
    const { email, password, firstName, lastName } = req.body as RegisterSchema;

    const serviceResponse = await AuthService.register(
      email,
      password,
      firstName,
      lastName
    );

    if (!serviceResponse.success) {
      res.sendErrorResponse(
        AuthResponses.register.failed,
        serviceResponse.errors
      );
      return;
    }

    res.sendSuccessResponse(
      AuthResponses.register.success,
      serviceResponse.data
    );
  }
*/
}
