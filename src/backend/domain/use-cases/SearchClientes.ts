import { z } from "zod";
import { ICliente } from "../../../shared/entities";
import { ClienteRepository } from "../../persistence/ClienteRepository";

export const SearchQuerySchema = z.object({
  query: z.string().min(1, "A busca não pode ser vazia.").max(50),
});

export type ISearchQueryDTO = z.infer<typeof SearchQuerySchema>;

export class SearchClientes {
  private repository: ClienteRepository;
  private readonly LIMIT = 10;

  constructor() {
    this.repository = new ClienteRepository();
  }

  public execute(
    query: string,
    prestadorId: string
  ): Array<{ id: string; nome: string }> {
    const validatedQuery = SearchQuerySchema.parse({ query }).query;
    const clientes = this.repository.searchByQuery(
      validatedQuery,
      prestadorId,
      this.LIMIT
    );
    return clientes;
  }
}
