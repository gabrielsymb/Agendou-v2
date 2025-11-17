import {
  AgendamentoRepository,
  IHistoricoDB,
} from "../../persistence/AgendamentoRepository";
import { z } from "zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

// Tipo de retorno formatado para o Frontend
export interface IHistoricoServico {
  agendamentoId: string;
  data: string; // YYYY-MM-DD
  hora: string; // HH:mm
  status: "Agendado" | "Concluido" | "Cancelado" | "Reagendado";
  servicoNome: string;
  servicoPreco: number;
  servicoDuracaoMinutos: number;
}

export class GetClientHistory {
  private agendamentoRepository: AgendamentoRepository;

  constructor() {
    this.agendamentoRepository = new AgendamentoRepository();
  }

  /**
   * Retorna o histórico de agendamentos para um cliente específico.
   */
  public execute(
    clienteId: string,
    prestadorId: string,
    options?: {
      startIso?: string;
      endIso?: string;
      limit?: number;
      offset?: number;
    }
  ): IHistoricoServico[] {
    // Regra de segurança/domínio: verificar se o ID é um UUID válido.
    if (!z.string().uuid().safeParse(clienteId).success) {
      throw new Error("ID de Cliente inválido.");
    }

    const opts = {
      limit: options?.limit ?? 50,
      offset: options?.offset ?? 0,
      startIso: options?.startIso,
      endIso: options?.endIso,
    };

    const historicoDB: IHistoricoDB[] =
      this.agendamentoRepository.getClientHistory(clienteId, prestadorId, opts);

    const historicoFormatado: IHistoricoServico[] = historicoDB.map((item) => {
      const date = dayjs.utc(item.dataHoraInicio);
      return {
        agendamentoId: item.id,
        data: date.format("YYYY-MM-DD"),
        hora: date.format("HH:mm"),
        status: item.status,
        servicoNome: item.servicoNome,
        servicoPreco: item.servicoPreco,
        servicoDuracaoMinutos: item.servicoDuracaoMinutos,
      };
    });

    return historicoFormatado;
  }
}
