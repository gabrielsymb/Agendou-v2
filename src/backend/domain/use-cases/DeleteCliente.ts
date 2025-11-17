import { ClienteRepository } from "../../persistence/ClienteRepository";

export class DeleteCliente {
  private repository: ClienteRepository;

  constructor() {
    this.repository = new ClienteRepository();
  }

  public execute(id: string, prestadorId: string): void {
    const clienteExistente = this.repository.findById(id, prestadorId);
    if (!clienteExistente) {
      throw new Error("Cliente não encontrado.");
    }

    const changes = this.repository.delete(id, prestadorId);
    if (typeof changes === "number" && changes === 0) {
      throw new Error("Cliente não encontrado.");
    }
  }
}
