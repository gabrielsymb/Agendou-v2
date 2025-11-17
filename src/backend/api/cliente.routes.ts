import express from "express";
import { CreateCliente } from "../domain/use-cases/CreateCliente";
import {
  UpdateCliente,
  IUpdateClienteDTO,
} from "../domain/use-cases/UpdateCliente";
import { DeleteCliente } from "../domain/use-cases/DeleteCliente";
import { authMiddleware, AuthedRequest } from "../middlewares/auth";
import { ClienteRepository } from "../persistence/ClienteRepository";

const router = express.Router();
const createCliente = new CreateCliente();
const clienteRepo = new ClienteRepository();

import { SearchClientes } from "../domain/use-cases/SearchClientes";

router.post("/", authMiddleware, (req: AuthedRequest, res) => {
  try {
    const payload = { ...req.body, prestadorId: req.prestadorId };
    const result = createCliente.execute(payload);
    return res.status(201).json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message || "Invalid request" });
  }
});

// PUT /api/v1/clientes/:id -> atualiza cliente
router.put("/:id", authMiddleware, (req: AuthedRequest, res) => {
  try {
    const id = req.params.id;
    const prestadorId = req.prestadorId as string;

    const updateUseCase = new UpdateCliente();
    const cliente = updateUseCase.execute(
      id,
      req.body as IUpdateClienteDTO,
      prestadorId
    );

    return res
      .status(200)
      .json({ message: "Cliente atualizado com sucesso", cliente });
  } catch (error: any) {
    if (error && error.issues) {
      return res
        .status(400)
        .json({
          message: "Dados de entrada inválidos para atualização.",
          errors: error.issues,
        });
    }

    if (
      error instanceof Error &&
      error.message.includes("Cliente não encontrado")
    ) {
      return res.status(404).json({ message: error.message });
    }

    return res.status(400).json({ error: error.message || "Invalid request" });
  }
});

// GET /api/v1/clientes/search?q=termo -> busca/autocomplete
router.get("/search", authMiddleware, (req: AuthedRequest, res) => {
  try {
    const prestadorId = req.prestadorId as string;
    const q = (req.query.q as string) || "";
    if (!q || q.trim().length === 0) {
      return res
        .status(400)
        .json({ message: "O termo de busca (query) é obrigatório." });
    }

    const searchClientes = new SearchClientes();
    const clientes = searchClientes.execute(q, prestadorId);
    return res.status(200).json({ clientes });
  } catch (err: any) {
    return res
      .status(400)
      .json({ message: "Busca inválida.", error: err.message });
  }
});

// DELETE /api/v1/clientes/:id -> remove cliente
router.delete("/:id", authMiddleware, (req: AuthedRequest, res) => {
  try {
    const id = req.params.id;
    const prestadorId = req.prestadorId as string;

    const deleteUseCase = new DeleteCliente();
    deleteUseCase.execute(id, prestadorId);

    return res.status(204).send();
  } catch (error: any) {
    if (
      error instanceof Error &&
      error.message.includes("Cliente não encontrado")
    ) {
      return res.status(404).json({ message: error.message });
    }
    return res.status(400).json({ error: error.message || "Invalid request" });
  }
});

export default router;
