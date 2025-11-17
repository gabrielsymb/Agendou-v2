import { getDbInstance } from "../database";
import { IAgendamento } from "../../shared/entities";
import { Database } from "better-sqlite3";

// Tipo de retorno enriquecido para exibição (JOIN com clientes e servicos)
export interface IAgendamentoEnriquecidoDB extends IAgendamento {
  clienteNome: string;
  servicoNome: string;
}

// --- NOVO TIPO para o retorno enriquecido (dados extras de Serviço) ---
export interface IHistoricoDB {
  id: string; // agendamentoId
  dataHoraInicio: string;
  status: "Agendado" | "Concluido" | "Cancelado" | "Reagendado";
  servicoNome: string;
  servicoPreco: number;
  servicoDuracaoMinutos: number;
}

export class AgendamentoRepository {
  private db: Database;

  constructor() {
    this.db = getDbInstance();
  }

  /**
   * Busca agendamentos que conflitam com um período específico.
   * @param prestadorId ID do prestador.
   * @param inicio Nova data/hora de início (ISO string).
   * @param fim Nova data/hora de fim (ISO string).
   * @param agendamentoIdToExclude ID de um agendamento a ser excluído (usado em PUT/Update/Reagendamento).
   */
  public findConflictingAppointments(
    prestadorId: string,
    inicio: string,
    fim: string,
    agendamentoIdToExclude?: string
  ): IAgendamento[] {
    let query = `
            SELECT * FROM agendamentos 
            WHERE prestadorId = ? 
            AND status NOT IN ('Concluido', 'Cancelado')
            AND (
                dataHoraFim > ?
                AND dataHoraInicio < ?
            )
        `;
    const params: (string | undefined)[] = [prestadorId, inicio, fim];

    if (agendamentoIdToExclude) {
      query += ` AND id != ?`;
      params.push(agendamentoIdToExclude);
    }

    const stmt = this.db.prepare(query);
    const conflitos = stmt.all(...(params as string[]));

    return conflitos as IAgendamento[];
  }

  public create(agendamento: IAgendamento): void {
    const stmt = this.db.prepare(`
            INSERT INTO agendamentos 
            (id, prestadorId, clienteId, servicoId, dataHoraInicio, dataHoraFim, status, posicao)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
    stmt.run(
      agendamento.id,
      agendamento.prestadorId,
      agendamento.clienteId,
      agendamento.servicoId,
      agendamento.dataHoraInicio,
      agendamento.dataHoraFim,
      agendamento.status,
      agendamento.posicao || 0
    );
  }

  /**
   * Lista agendamentos entre duas datas (inclusive) para um prestador.
   */
  public findBetween(
    prestadorId: string,
    startIso: string,
    endIso: string
  ): IAgendamento[] {
    const stmt = this.db.prepare(`
            SELECT * FROM agendamentos
            WHERE prestadorId = ?
            AND dataHoraInicio >= ?
            AND dataHoraInicio <= ?
            ORDER BY dataHoraInicio ASC
        `);
    const rows = stmt.all(prestadorId, startIso, endIso);
    return rows as IAgendamento[];
  }

  /**
   * Lista agendamentos para um dia específico, ordenados por status e posição/hora.
   * Inclui JOIN com clientes e serviços para enriquecer os dados de exibição.
   */
  public findByDay(
    prestadorId: string,
    dataInicioUTC: string,
    dataFimUTC: string
  ): IAgendamentoEnriquecidoDB[] {
    const query = `
            SELECT 
                a.*, 
                c.nome AS clienteNome, 
                s.nome AS servicoNome
            FROM agendamentos a
            JOIN clientes c ON a.clienteId = c.id
            JOIN servicos s ON a.servicoId = s.id
            WHERE a.prestadorId = ? 
            AND a.dataHoraInicio >= ? 
            AND a.dataHoraInicio < ?
            ORDER BY 
                CASE 
                    WHEN a.status IN ('Agendado', 'Reagendado') THEN 1 
                    ELSE 2 
                END ASC,
                a.posicao ASC,
                a.dataHoraInicio ASC
        `;

    const stmt = this.db.prepare(query);
    const rawAgendamentos = stmt.all(prestadorId, dataInicioUTC, dataFimUTC);

    return rawAgendamentos as IAgendamentoEnriquecidoDB[];
  }

  /**
   * Busca um agendamento pelo ID, garantindo que ele pertence ao prestador logado.
   */
  public findById(id: string, prestadorId: string) {
    const stmt = this.db.prepare(
      `SELECT * FROM agendamentos WHERE id = ? AND prestadorId = ?`
    );
    const agendamento = stmt.get(id, prestadorId);
    return agendamento as IAgendamento | undefined;
  }

  /**
   * Atualiza um agendamento.
   */
  public update(agendamento: IAgendamento): void {
    const stmt = this.db.prepare(`
            UPDATE agendamentos 
            SET clienteId = ?, servicoId = ?, dataHoraInicio = ?, dataHoraFim = ?, status = ?, posicao = ?
            WHERE id = ? AND prestadorId = ?
        `);
    stmt.run(
      agendamento.clienteId,
      agendamento.servicoId,
      agendamento.dataHoraInicio,
      agendamento.dataHoraFim,
      agendamento.status,
      agendamento.posicao,
      agendamento.id,
      agendamento.prestadorId
    );
  }

  /**
   * Deleta um agendamento, garantindo o prestadorId.
   */
  public delete(id: string, prestadorId: string): void {
    const stmt = this.db.prepare(
      `DELETE FROM agendamentos WHERE id = ? AND prestadorId = ?`
    );
    stmt.run(id, prestadorId);
  }

  /**
   * Reajusta a posição dos agendamentos do dia após a exclusão de um item.
   * (Assume que a reindexação só é relevante para agendamentos do mesmo dia.)
   */
  public reindexPosicaoAfterDelete(
    deletedPosicao: number,
    prestadorId: string,
    dataHoraInicio: string
  ): void {
    const day = dataHoraInicio.substring(0, 10); // Ex: '2025-11-17'

    const stmt = this.db.prepare(`
            UPDATE agendamentos 
            SET posicao = posicao - 1
            WHERE prestadorId = ? 
            AND posicao > ? 
            AND SUBSTR(dataHoraInicio, 1, 10) = ?
            AND status NOT IN ('Concluido', 'Cancelado')
        `);
    stmt.run(prestadorId, deletedPosicao, day);
  }

  /**
   * Inicia uma transação no banco de dados.
   */
  public startTransaction(): void {
    this.db.prepare("BEGIN").run();
  }

  /**
   * Finaliza a transação (commit).
   */
  public commitTransaction(): void {
    this.db.prepare("COMMIT").run();
  }

  /**
   * Desfaz a transação (rollback).
   */
  public rollbackTransaction(): void {
    this.db.prepare("ROLLBACK").run();
  }

  /**
   * Atualiza apenas o campo 'posicao' de um agendamento.
   */
  public updatePosicao(id: string, prestadorId: string, posicao: number): void {
    const stmt = this.db.prepare(`
            UPDATE agendamentos 
            SET posicao = ?
            WHERE id = ? AND prestadorId = ?
        `);
    stmt.run(posicao, id, prestadorId);
  }

  /**
   * Busca o histórico de serviços (agendamentos) para um cliente.
   */
  public getClientHistory(
    clienteId: string,
    prestadorId: string,
    options?: {
      startIso?: string;
      endIso?: string;
      limit?: number;
      offset?: number;
    }
  ): IHistoricoDB[] {
    let query = `
            SELECT 
                a.id, 
                a.dataHoraInicio, 
                a.status,
                s.nome AS servicoNome,
                s.preco AS servicoPreco,
                s.duracaoMinutos AS servicoDuracaoMinutos
            FROM agendamentos a
            JOIN servicos s ON a.servicoId = s.id
            WHERE a.clienteId = ? 
            AND a.prestadorId = ?
        `;

    const params: (string | number)[] = [clienteId, prestadorId];

    if (options?.startIso) {
      query += ` AND a.dataHoraInicio >= ?`;
      params.push(options.startIso);
    }

    if (options?.endIso) {
      query += ` AND a.dataHoraInicio <= ?`;
      params.push(options.endIso);
    }

    query += ` ORDER BY a.dataHoraInicio DESC`;

    if (typeof options?.limit === "number") {
      query += ` LIMIT ?`;
      params.push(options.limit);
    }

    if (typeof options?.offset === "number") {
      query += ` OFFSET ?`;
      params.push(options.offset);
    }

    const stmt = this.db.prepare(query);
    const historico = stmt.all(...params);

    return historico as IHistoricoDB[];
  }
}
