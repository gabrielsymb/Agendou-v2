import { z } from "zod";
import {
  AgendamentoRepository,
  IAgendamentoEnriquecidoDB,
} from "../../persistence/AgendamentoRepository";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const ListAgendamentosDiaSchema = z.object({
  data: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido. Use YYYY-MM-DD."),
});

export type IListAgendamentosDiaDTO = z.infer<typeof ListAgendamentosDiaSchema>;

interface IAgendamentoEnriquecido extends IAgendamentoEnriquecidoDB {}

/**
 * Lista os agendamentos de um dado dia (UTC) para um prestador.
 * Ordenação: status (prioritiza Agendado/Reagendado), posicao, dataHoraInicio.
 */
export class ListAgendamentosDia {
  private repository: AgendamentoRepository;

  constructor() {
    this.repository = new AgendamentoRepository();
  }

  public execute(
    dateIso: string,
    prestadorId: string
  ): IAgendamentoEnriquecido[] {
    // 1. Validação de Data
    const validated = ListAgendamentosDiaSchema.parse({ data: dateIso });

    // 2. Calcular intervalo UTC: [startOfDay, startOfNextDay)
    const inicioDia = dayjs.utc(validated.data).startOf("day").toISOString();
    const fimDia = dayjs
      .utc(validated.data)
      .add(1, "day")
      .startOf("day")
      .toISOString();

    // 3. Buscar via repository (já retorna enriquecido com clienteNome e servicoNome)
    const rows = this.repository.findByDay(prestadorId, inicioDia, fimDia);

    // 4. Ordenação adicional em memória (repository já ordena, mas garantimos a ordem por segurança)
    const statusOrder: Record<string, number> = {
      Agendado: 1,
      Reagendado: 1,
      Confirmado: 2,
      "Em Andamento": 3,
      Concluido: 4,
      Cancelado: 5,
    };

    const sorted = rows.sort((a, b) => {
      const sa = statusOrder[a.status] ?? 99;
      const sb = statusOrder[b.status] ?? 99;
      if (sa !== sb) return sa - sb;
      const pa = a.posicao ?? 0;
      const pb = b.posicao ?? 0;
      if (pa !== pb) return pa - pb;
      return a.dataHoraInicio.localeCompare(b.dataHoraInicio);
    });

    return sorted as IAgendamentoEnriquecido[];
  }
}
