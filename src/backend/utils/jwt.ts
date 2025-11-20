import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET && process.env.NODE_ENV === "production") {
  console.error("FATAL: JWT_SECRET não definido. Defina a variável de ambiente JWT_SECRET.");
  process.exit(1);
}

if (!JWT_SECRET) {
  // Em ambiente de desenvolvimento, mostramos aviso e usamos um valor temporário
  console.warn("Aviso: JWT_SECRET não definido. Usando segredo temporário em ambiente de desenvolvimento.");
}

export type JwtPayloadMinimal = {
  id: string;
  prestadorId: string;
  email: string;
};

export function generateToken(payload: JwtPayloadMinimal): string {
  const token = jwt.sign(payload, JWT_SECRET || "dev_fallback_secret", { expiresIn: "7d" });
  return token;
}

export function verifyToken(token: string): JwtPayloadMinimal | null {
  try {
  return jwt.verify(token, JWT_SECRET || "dev_fallback_secret") as JwtPayloadMinimal;
  } catch (err) {
    return null;
  }
}
