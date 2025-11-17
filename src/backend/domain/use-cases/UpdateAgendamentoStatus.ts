import { z } from "zod";
import { IAgendamento } from "../../../shared/entities";
import { AgendamentoRepository } from "../../persistence/AgendamentoRepository";

export const StatusSchema = z.object({
  status: z.enum(["Concluido", "Cancelado"]),
});

export type IUpdateStatusDTO = z.infer<typeof StatusSchema>;

export class UpdateAgendamentoStatus {
  private repository: AgendamentoRepository;

  constructor() {
    this.repository = new AgendamentoRepository();
  }

  public execute(
    id: string,
    status: "Concluido" | "Cancelado",
    prestadorId: string
  ): IAgendamento {
    const validatedData = StatusSchema.parse({ status });

    const agendamentoExistente = this.repository.findById(id, prestadorId);
    if (!agendamentoExistente) {
      throw new Error("Agendamento não encontrado.");
    }

    const agendamentoAtualizado: IAgendamento = {
      ...agendamentoExistente,
      status: validatedData.status,
      posicao: 0,
    };

    this.repository.update(agendamentoAtualizado);

    return agendamentoAtualizado;
  }
}
