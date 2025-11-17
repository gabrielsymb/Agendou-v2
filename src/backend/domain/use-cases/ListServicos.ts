import { ServicoRepository } from "../../persistence/ServicoRepository";
import { IServico } from "../../../shared/entities";

export class ListServicos {
  private repo = new ServicoRepository();

  execute(prestadorId: string): IServico[] {
    return this.repo.findAllByPrestadorId(prestadorId);
  }
}
