import { AgendamentoRepository } from "../../persistence/AgendamentoRepository";

export class DeleteAgendamento {
  private repository: AgendamentoRepository;

  constructor() {
    this.repository = new AgendamentoRepository();
  }

  public execute(id: string, prestadorId: string): void {
    const agendamentoExistente = this.repository.findById(id, prestadorId);
    if (!agendamentoExistente) {
      throw new Error("Agendamento não encontrado.");
    }

    this.repository.delete(id, prestadorId);

    this.repository.reindexPosicaoAfterDelete(
      agendamentoExistente.posicao ?? 0,
      prestadorId,
      agendamentoExistente.dataHoraInicio
    );
  }
}
