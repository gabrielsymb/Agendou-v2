import { z } from "zod";
import { ClienteRepository } from "../../persistence/ClienteRepository";
import { ICliente } from "../../../shared/entities";
import { randomUUID } from "crypto";
import { normalizePhoneBR } from "../../utils/phone";

const createClienteSchema = z.object({
  prestadorId: z.string().uuid(),
  nome: z.string().min(1, { message: "Nome é obrigatório" }),
  telefone: z.string().min(6),
  email: z.string().email().optional(),
  notas: z.string().optional(),
});

export class CreateCliente {
  private repo: ClienteRepository;

  constructor(repo?: ClienteRepository) {
    this.repo = repo ?? new ClienteRepository();
  }

  public execute(payload: unknown) {
    let parsed;
    try {
      parsed = createClienteSchema.parse(payload);
    } catch (err: any) {
      // ZodError -> retorna mensagem clara
      if (err?.errors) {
        const messages = err.errors.map((e: any) => e.message).join("; ");
        throw new Error(messages);
      }
      throw err;
    }

    const normalized = normalizePhoneBR(parsed.telefone);
    if (!normalized)
      throw new Error(
        "Telefone inválido. Envie um número válido (ex: 81984070337)"
      );

    const cliente: ICliente = {
      id: randomUUID(),
      prestadorId: parsed.prestadorId,
      nome: parsed.nome,
      telefone: normalized,
      email: parsed.email || null,
      notas: parsed.notas || null,
    } as ICliente;

    this.repo.create(cliente);

    // Retorna o cliente criado (sem campos sensíveis)
    return {
      message: "Cliente criado com sucesso!",
      cliente: {
        id: cliente.id,
        prestadorId: cliente.prestadorId,
        nome: cliente.nome,
        telefone: cliente.telefone,
        email: cliente.email,
        notas: cliente.notas,
      },
    };
  }
}
