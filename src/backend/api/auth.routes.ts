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
    const signIn = new SignInPrestador();
    const prestador = await signIn.execute(req.body as ISignInPrestadorDTO);

    const token = generateToken({
      id: prestador.id,
      prestadorId: prestador.prestadorId,
      email: prestador.email,
    });

    return res.status(200).json({
      message: "Login bem-sucedido!",
      prestadorId: prestador.prestadorId,
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
    const prestador = register.execute(req.body as IRegisterPrestadorDTO);

    // Gera token após cadastro
    const token = generateToken({
      id: prestador.id,
      prestadorId: prestador.prestadorId,
      email: prestador.email,
    });

    return res
      .status(201)
      .json({
        message:
          "Conta criada com sucesso! Você recebeu uma licença de teste de 7 dias.",
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
      error.message.includes("email já está cadastrado")
    ) {
      return res.status(409).json({ message: error.message });
    }
    throw error;
  }
});

export default authRoutes;
