import { Router } from "express";
import {
  CreatePrestador,
  ICreatePrestadorDTO,
} from "../domain/use-cases/CreatePrestador";
import {
  RegisterPrestador,
  IRegisterPrestadorDTO,
} from "../domain/use-cases/RegisterPrestador";
import { ZodError } from "zod";
import {
  SignInPrestador,
  ISignInPrestadorDTO,
} from "../domain/use-cases/SignInPrestador";
import { generateToken } from "../utils/jwt";

const authRoutes = Router();

authRoutes.post("/signup", async (req, res) => {
  try {
    const createPrestador = new CreatePrestador();
    const prestador = await createPrestador.execute(
      req.body as ICreatePrestadorDTO
    );

    // Gera token após cadastro (payload mínimo)
    const token = generateToken({
      id: prestador.id,
      prestadorId: prestador.prestadorId,
      email: prestador.email,
    });

    return res.status(201).json({
      message: "Conta criada com sucesso!",
      prestador,
      token,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ message: "Dados de entrada inválidos.", errors: error.issues });
    }

    if (error instanceof Error && error.message === "E-mail já registrado.") {
      return res.status(409).json({ message: error.message });
    }

    throw error;
  }
});

// Rota de Login
authRoutes.post("/login", async (req, res) => {
  try {
  // DEBUG: log body received from client to compare node vs browser requests
  try { console.log('[POST /auth/login] body=', req.body); } catch(e){}
    const signIn = new SignInPrestador();
    const prestador = await signIn.execute(req.body as ISignInPrestadorDTO);

    const token = generateToken({
      id: prestador.id,
      prestadorId: prestador.prestadorId,
      email: prestador.email,
    });

    return res.status(200).json({
      message: "Login bem-sucedido!",
      prestador,
      token,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ message: "Dados de entrada inválidos.", errors: error.issues });
    }

    if (
      error instanceof Error &&
      error.message.includes("Credenciais inválidas")
    ) {
      return res.status(401).json({ message: error.message });
    }

    throw error;
  }
});

// Rota de Registro (alias /register) - usa RegisterPrestador para criar prestador + licença
authRoutes.post("/register", async (req, res) => {
  try {
    const register = new RegisterPrestador();
    const prestador = await register.execute(req.body as IRegisterPrestadorDTO);

    const token = generateToken({
      id: prestador.id,
      prestadorId: prestador.prestadorId,
      email: prestador.email,
    });

    return res.status(201).json({
      message:
        "Conta criada com sucesso! Você recebeu uma licença de teste de 7 dias.",
      prestador,
      token,
    });
  } catch (error: any) {
    // ZodError (validação)
    if (error && (error.name === "ZodError" || error.issues)) {
      return res
        .status(400)
        .json({ message: "Dados de entrada inválidos.", errors: error.issues || error });
    }

    // Mapear mensagens de "email duplicado" para 409 (Conflict)
    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      const isDuplicateEmail =
        (msg.includes("email") && (msg.includes("cadastrad") || msg.includes("já") || msg.includes("já existe"))) ||
        msg.includes("já registrado") ||
        msg.includes("email duplicado");

      if (isDuplicateEmail) {
        return res.status(409).json({ message: error.message });
      }
    }

    // fallback: erro interno
    console.error("Erro em POST /register:", error && (error.stack || error));
    return res.status(500).json({ message: "Erro interno no servidor." });
  }
});

export default authRoutes;
