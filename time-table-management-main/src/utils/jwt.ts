import jwt from "jsonwebtoken";

import { JWT_SECRET } from "./env";

export class JWTUtils {
  static expireTime = 60 * 60 * 24; // 1 day in seconds

  static signUserToken(userId: string) {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: this.expireTime });
  }

  static verifyToken(token: string) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
      return decoded.userId;
    } catch {
      return null;
    }
  }
}
