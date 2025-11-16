import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_invalido";

export type JwtPayloadMinimal = {
  id: string;
  prestadorId: string;
  email: string;
};

export function generateToken(payload: JwtPayloadMinimal): string {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  return token;
}

export function verifyToken(token: string): JwtPayloadMinimal | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayloadMinimal;
  } catch (err) {
    return null;
  }
}
