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

  // Compatibilidade: alguns tokens antigos podem não ter a propriedade `prestadorId`.
  // Para desenvolvimento, aceitamos `payload.id` como fallback.
  const resolvedPrestadorId = (payload as any).prestadorId || (payload as any).id;
  if (!resolvedPrestadorId) {
    // Log útil para debugging (apenas em dev)
    if (process.env.NODE_ENV !== 'production') {
      console.warn('authMiddleware: token payload missing prestadorId and id', payload);
    }
    return res.status(401).json({ error: 'Prestador não autenticado' });
  }
  req.prestadorId = resolvedPrestadorId;
  req.prestadorEmail = (payload as any).email;

  // === TEMP DEBUG START ===
  try {
    if (process.env.NODE_ENV !== 'production') {
      const email = (payload as any).email || '(no-email)';
      const matchesSeed = resolvedPrestadorId === 'prestador-seed-1';
      console.log(`[DEBUG][auth] prestadorId=${resolvedPrestadorId} email=${email} matchesSeed=${matchesSeed}`);
    }
  } catch (dbg) {
    // ignore debug errors
  }
  // === TEMP DEBUG END ===
  next();
}
