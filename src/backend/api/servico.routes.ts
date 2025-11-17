import express from "express";
import { authMiddleware, AuthedRequest } from "../middlewares/auth";
import {
  CreateServico,
  ICreateServicoDTO,
} from "../domain/use-cases/CreateServico";
import { ListServicos } from "../domain/use-cases/ListServicos";
import {
  UpdateServico,
  IUpdateServicoDTO,
} from "../domain/use-cases/UpdateServico";
import { DeleteServico } from "../domain/use-cases/DeleteServico";

const router = express.Router();

// POST /api/v1/servicos
router.post("/", authMiddleware, (req: AuthedRequest, res) => {
  try {
    const prestadorId = req.prestadorId as string;
    const create = new CreateServico();
    const servico = create.execute(req.body as ICreateServicoDTO, prestadorId);
    return res
      .status(201)
      .json({ message: "Serviço criado com sucesso", servico });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || "Invalid request" });
  }
});

// GET /api/v1/servicos
router.get("/", authMiddleware, (req: AuthedRequest, res) => {
  try {
    const prestadorId = req.prestadorId as string;
    const list = new ListServicos();
    const servicos = list.execute(prestadorId);
    return res.status(200).json({ servicos });
  } catch (err: any) {
    return res.status(400).json({ error: err.message || "Invalid request" });
  }
});

// PUT /api/v1/servicos/:id
router.put("/:id", authMiddleware, (req: AuthedRequest, res) => {
  try {
    const id = req.params.id;
    const prestadorId = req.prestadorId as string;
    const update = new UpdateServico();
    const servico = update.execute(
      id,
      prestadorId,
      req.body as IUpdateServicoDTO
    );
    return res.status(200).json({ message: "Serviço atualizado", servico });
  } catch (err: any) {
    if (err.message && err.message.includes("não encontrado")) {
      return res.status(404).json({ message: err.message });
    }
    return res.status(400).json({ error: err.message || "Invalid request" });
  }
});

// DELETE /api/v1/servicos/:id
router.delete("/:id", authMiddleware, (req: AuthedRequest, res) => {
  try {
    const id = req.params.id;
    const prestadorId = req.prestadorId as string;
    const del = new DeleteServico();
    del.execute(id, prestadorId);
    return res.status(204).send();
  } catch (err: any) {
    if (err.message && err.message.includes("não encontrado")) {
      return res.status(404).json({ message: err.message });
    }
    return res.status(400).json({ error: err.message || "Invalid request" });
  }
});

export default router;
