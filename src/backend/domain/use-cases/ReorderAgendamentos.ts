import { z, ZodError } from "zod";
import { AgendamentoRepository } from "../../persistence/AgendamentoRepository";

export const ReorderAgendamentosSchema = z.object({
  agendamentoIds: z.array(z.string().uuid("ID de agendamento inválido.")),
  data: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de data inválido. Use YYYY-MM-DD."),
});

export type IReorderAgendamentosDTO = z.infer<typeof ReorderAgendamentosSchema>;

export class ReorderAgendamentos {
  private repository: AgendamentoRepository;

  constructor() {
    this.repository = new AgendamentoRepository();
  }

  public execute(data: IReorderAgendamentosDTO, prestadorId: string): void {
    const validatedData = ReorderAgendamentosSchema.parse(data);
    const { agendamentoIds, data: day } = validatedData;

    // 1) Validação prévia: garantir que todos os IDs existem e pertencem ao mesmo dia
    const mismatches: string[] = [];
    const missing: string[] = [];

    agendamentoIds.forEach((id) => {
      const item = this.repository.findById(id, prestadorId);
      if (!item) {
        missing.push(id);
        return;
      }

      const itemDay = item.dataHoraInicio.substring(0, 10); // YYYY-MM-DD
      if (itemDay !== day) {
        mismatches.push(id);
      }
    });

    if (missing.length > 0) {
      throw new Error(
        `Alguns agendamentos não foram encontrados: ${missing.join(", ")}`
      );
    }

    if (mismatches.length > 0) {
      throw new Error(
        `Os seguintes agendamentos não pertencem ao dia ${day}: ${mismatches.join(
          ", "
        )}`
      );
    }

    // 2) Agora que validamos tudo, aplicamos as atualizações em transação
    this.repository.startTransaction();
    try {
      agendamentoIds.forEach((id, index) => {
        const newPosicao = index + 1;
        this.repository.updatePosicao(id, prestadorId, newPosicao);
      });

      this.repository.commitTransaction();
    } catch (error) {
      this.repository.rollbackTransaction();
      if (error instanceof ZodError) throw error;
      throw new Error(`Falha ao reordenar agendamentos: ${String(error)}`);
    }
  }
}
