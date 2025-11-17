import { ServicoRepository } from "../../persistence/ServicoRepository";
import { IServico } from "../../../shared/entities";

export type IUpdateServicoDTO = Partial<
  Pick<IServico, "nome" | "duracaoMinutos" | "preco" | "posicao">
>;

export class UpdateServico {
  private repo = new ServicoRepository();

  execute(id: string, prestadorId: string, patch: IUpdateServicoDTO) {
    const changes = this.repo.update(
      id,
      prestadorId,
      patch as Partial<IServico>
    );
    if (!changes) throw new Error("Serviço não encontrado ou sem permissão");
    return this.repo.findById(id);
  }
}
