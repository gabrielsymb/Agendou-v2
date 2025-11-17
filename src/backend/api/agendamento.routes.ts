import express from "express";
import { ZodError } from "zod";
import {
  ReorderAgendamentos,
  IReorderAgendamentosDTO,
} from "../domain/use-cases/ReorderAgendamentos";

const agendamentoRoutes = express.Router();

// Rota de Reordenação Manual (Drag-and-Drop) - PUT /api/v1/agendamentos/reorder
agendamentoRoutes.put("/reorder", (req, res, next) => {
  try {
    const prestadorId = (req as any).prestadorId as string;
    if (!prestadorId)
      return res.status(401).json({ message: "Prestador não autenticado." });

    const reorderAgendamentos = new ReorderAgendamentos();
    reorderAgendamentos.execute(
      req.body as IReorderAgendamentosDTO,
      prestadorId
    );

    return res
      .status(200)
      .json({ message: "Ordem da agenda atualizada com sucesso." });
  } catch (error) {
    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({
          message: "Dados de entrada inválidos para reordenação.",
          errors: error.issues,
        });
    }
    return next(error);
  }
});

export default agendamentoRoutes;
