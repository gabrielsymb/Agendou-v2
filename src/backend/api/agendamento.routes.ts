import express from 'express';
import { z } from 'zod';
import { authMiddleware, AuthedRequest } from '../middlewares/auth'; // usar export nomeado

const agendamentoRoutes = express.Router();

/**
 * DTO para reorder — declarado uma vez
 */
interface IReorderAgendamentosDTO {
  agendamentoIds: Array<number | string>;
}

/**
 * GET /api/v1/agendamentos?data=YYYY-MM-DD
 */
agendamentoRoutes.get('/', authMiddleware, async (req: AuthedRequest, res, next) => {
  try {
    // implementar: use-case ListAgendamentosDia
    const { data } = req.query;
    // exemplo placeholder
    res.json([]);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/agendamentos
 */
agendamentoRoutes.post('/', authMiddleware, async (req: AuthedRequest, res, next) => {
  try {
    // implementar criação real
    res.status(201).json({ ok: true });
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/v1/agendamentos/:id
 */
agendamentoRoutes.put('/:id', authMiddleware, async (req: AuthedRequest, res, next) => {
  try {
    // implementar atualização
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

/**
 * DELETE /api/v1/agendamentos/:id
 */
agendamentoRoutes.delete('/:id', authMiddleware, async (req: AuthedRequest, res, next) => {
  try {
    // implementar remoção
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /api/v1/agendamentos/reorder
 */
agendamentoRoutes.put('/reorder', authMiddleware, async (req: AuthedRequest, res, next) => {
  try {
    const body = req.body as Partial<IReorderAgendamentosDTO>;
    if (!body || !Array.isArray(body.agendamentoIds)) {
      return res.status(400).json({ message: 'agendamentoIds é obrigatório' });
    }
    // implementar reorder no DB (transação)
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default agendamentoRoutes;
