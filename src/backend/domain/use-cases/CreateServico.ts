import { ServicoRepository } from "../../persistence/ServicoRepository";
import { IServico } from "../../../shared/entities";
import crypto from "crypto";

export type ICreateServicoDTO = Omit<
  IServico,
  "id" | "prestadorId" | "posicao"
>;

export class CreateServico {
  private repo = new ServicoRepository();

  execute(data: ICreateServicoDTO, prestadorId: string) {
    const id = crypto.randomUUID();
    const posicao = this.repo.getNextPosicao(prestadorId);
    const servico: IServico = {
      id,
      prestadorId,
      nome: data.nome,
      duracaoMinutos: data.duracaoMinutos,
      preco: data.preco,
      posicao,
    };

    this.repo.create(servico);
    return servico;
  }
}
