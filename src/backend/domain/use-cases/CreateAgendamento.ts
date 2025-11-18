import { z } from "zod";
import { IAgendamento } from "../../../shared/entities";
import { AgendamentoRepository } from "../../persistence/AgendamentoRepository";
import { ServicoRepository } from "../../persistence/ServicoRepository";
import { randomUUID } from "crypto";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const CreateAgendamentoSchema = z.object({
  clienteId: z.string().uuid("ID de Cliente inválido."),
  servicoId: z.string().uuid("ID de Serviço inválido."),
  dataHoraInicio: z.string().datetime({
    message: "Formato de data/hora inválido. Use ISO string (UTC).",
  }),
});

export type ICreateAgendamentoDTO = z.infer<typeof CreateAgendamentoSchema>;

export class CreateAgendamento {
  private agendamentoRepository: AgendamentoRepository;
  private servicoRepository: ServicoRepository;

  constructor() {
    this.agendamentoRepository = new AgendamentoRepository();
    this.servicoRepository = new ServicoRepository();
  }

  public execute(
    data: ICreateAgendamentoDTO,
    prestadorId: string
  ): IAgendamento {
    const validated = CreateAgendamentoSchema.parse(data);

    const { clienteId, servicoId, dataHoraInicio } = validated;

    const servico = this.servicoRepository.findById(servicoId);
    if (!servico || servico.prestadorId !== prestadorId) {
      throw new Error(
        "Serviço não encontrado ou não pertence a este prestador."
      );
    }

    const inicio = dayjs.utc(dataHoraInicio);
    const fim = inicio.add(servico.duracaoMinutos, "minute");
    const dataHoraFim = fim.toISOString();

    const conflitos = this.agendamentoRepository.findConflictingAppointments(
      prestadorId,
      dataHoraInicio,
      dataHoraFim
    );

    if (conflitos.length > 0) {
      throw new Error(
        "Conflito de horário. O prestador já possui um agendamento ativo nesse período."
      );
    }

    const novo: IAgendamento = {
      id: randomUUID(),
      prestadorId,
      clienteId,
      servicoId,
      dataHoraInicio,
      dataHoraFim,
      status: "Agendado",
      posicao: 0,
    };

    this.agendamentoRepository.create(novo);

    return novo;
  }
}
