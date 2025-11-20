import express from 'express';
import { z } from 'zod';
import { authMiddleware, AuthedRequest } from '../middlewares/auth'; // usar export nomeado
import { AgendamentoRepository } from '../persistence/AgendamentoRepository';

const agendamentoRoutes = express.Router();

/**
 * DTO para reorder — declarado uma vez
 */
interface IReorderAgendamentosDTO {
  agendamentoIds: Array<number | string>;
}

/**
 * GET /api/v1/agendamentos?data=YYYY-MM-DD
 * Retorna agendamentos do dia para o prestador autenticado.
 */
agendamentoRoutes.get('/', authMiddleware, async (req: AuthedRequest, res, next) => {
  try {
    const prestadorId = req.prestadorId;
    if (!prestadorId) return res.status(401).json({ error: 'Prestador não autenticado' });

    const { data } = req.query;
    // data no formato YYYY-MM-DD ou undefined (hoje)
    const day = typeof data === 'string' && data.length === 10 ? data : new Date().toISOString().substring(0,10);

    // calcular range UTC: início 00:00:00 e fim 23:59:59.999 (exclusive end next day)
    const startIso = new Date(day + 'T00:00:00.000Z').toISOString();
    const endDate = new Date(startIso);
    endDate.setUTCDate(endDate.getUTCDate() + 1);
    const endIso = endDate.toISOString();

    const repo = new AgendamentoRepository();
    const ags = repo.findByDay(prestadorId, startIso, endIso);
    res.json(ags);
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
