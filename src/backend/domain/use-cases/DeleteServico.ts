import { ServicoRepository } from "../../persistence/ServicoRepository";

export class DeleteServico {
  private repo = new ServicoRepository();

  execute(id: string, prestadorId: string) {
    const changes = this.repo.delete(id, prestadorId);
    if (!changes) throw new Error("Serviço não encontrado ou sem permissão");
    return true;
  }
}
