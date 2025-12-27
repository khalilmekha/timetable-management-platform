import type { Request, Response } from "express";

export class MainController {
  static async welcome(req: Request, res: Response) {
    res.send("Welcome to the main route!");
  }

  static async healthCheck(req: Request, res: Response) {
    res.send("OK");
  }
}
