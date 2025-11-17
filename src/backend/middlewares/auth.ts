import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthedRequest extends Request {
  prestadorId?: string;
  prestadorEmail?: string;
}

export function authMiddleware(
  req: AuthedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];
  if (!authHeader || Array.isArray(authHeader)) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const tokenMatch = (authHeader as string).match(/^Bearer\s+(.+)$/i);
  if (!tokenMatch)
    return res
      .status(401)
      .json({ error: "Invalid Authorization header format" });

  const token = tokenMatch[1];
  const payload = verifyToken(token);
  if (!payload)
    return res.status(401).json({ error: "Invalid or expired token" });

  req.prestadorId = payload.prestadorId;
  req.prestadorEmail = payload.email;
  next();
}
