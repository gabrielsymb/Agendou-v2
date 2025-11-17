import { z } from "zod";
import { IAgendamento } from "../../../shared/entities";
import { AgendamentoRepository } from "../../persistence/AgendamentoRepository";
import { ServicoRepository } from "../../persistence/ServicoRepository";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export const UpdateAgendamentoSchema = z.object({
  clienteId: z.string().uuid("ID de Cliente inválido.").optional(),
  servicoId: z.string().uuid("ID de Serviço inválido.").optional(),
  dataHoraInicio: z
    .string()
    .datetime({
      message: "Formato de data/hora inválido. Use ISO string (UTC).",
    })
    .optional(),
  status: z
    .enum(["Agendado", "Concluido", "Cancelado", "Reagendado"])
    .optional(),
  posicao: z.number().int().min(0).optional(),
});

export type IUpdateAgendamentoDTO = z.infer<typeof UpdateAgendamentoSchema>;

export class UpdateAgendamento {
  private agendamentoRepository: AgendamentoRepository;
  private servicoRepository: ServicoRepository;

  constructor() {
    this.agendamentoRepository = new AgendamentoRepository();
    this.servicoRepository = new ServicoRepository();
  }

  public execute(
    id: string,
    data: IUpdateAgendamentoDTO,
    prestadorId: string
  ): IAgendamento {
    const validatedData = UpdateAgendamentoSchema.parse(data);

    const agendamentoExistente = this.agendamentoRepository.findById(
      id,
      prestadorId
    );
    if (!agendamentoExistente) {
      throw new Error("Agendamento não encontrado.");
    }

    const novoServicoId =
      validatedData.servicoId || agendamentoExistente.servicoId;
    const novaDataHoraInicio =
      validatedData.dataHoraInicio || agendamentoExistente.dataHoraInicio;

    const servico = this.servicoRepository.findById(novoServicoId);
    if (!servico || servico.prestadorId !== prestadorId) {
      throw new Error("Serviço inválido.");
    }

    const inicio = dayjs.utc(novaDataHoraInicio);
    const fim = inicio.add(servico.duracaoMinutos, "minute");
    const novaDataHoraFim = fim.toISOString();

    const conflitos = this.agendamentoRepository.findConflictingAppointments(
      prestadorId,
      novaDataHoraInicio,
      novaDataHoraFim,
      id
    );

    if (conflitos.length > 0) {
      throw new Error(
        "Conflito de horário. O reagendamento se sobrepõe a outro agendamento ativo."
      );
    }

    const agendamentoAtualizado: IAgendamento = {
      ...agendamentoExistente,
      ...validatedData,
      servicoId: novoServicoId,
      dataHoraInicio: novaDataHoraInicio,
      dataHoraFim: novaDataHoraFim,
      status: validatedData.dataHoraInicio
        ? "Reagendado"
        : validatedData.status || agendamentoExistente.status,
    };

    this.agendamentoRepository.update(agendamentoAtualizado);

    return agendamentoAtualizado;
  }
}
