import type { Request, Response } from "express";

export class ApiController {
  static async getApiInfo(req: Request, res: Response) {
    const apiInfo = {
      name: "API Name",
      version: "1.0.0",
      description: "API Description",
    };

    res.json(apiInfo);
  }
}
