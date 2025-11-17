import { z, ZodError } from "zod";
import { ICliente } from "../../../shared/entities";
import { ClienteRepository } from "../../persistence/ClienteRepository";
import { normalizePhoneBR } from "../../utils/phone";

export const UpdateClienteSchema = z.object({
  nome: z
    .string()
    .min(2, "O nome deve ter no mínimo 2 caracteres.")
    .max(100)
    .optional(),
  telefone: z
    .string()
    .regex(/^\d{8,15}$/, "Telefone deve conter apenas dígitos.")
    .optional(),
  email: z
    .string()
    .email("Formato de e-mail inválido.")
    .optional()
    .or(z.literal("")),
  notas: z
    .string()
    .max(500, "As notas podem ter no máximo 500 caracteres.")
    .optional()
    .or(z.literal("")),
});

export type IUpdateClienteDTO = z.infer<typeof UpdateClienteSchema>;

export class UpdateCliente {
  private repository: ClienteRepository;

  constructor() {
    this.repository = new ClienteRepository();
  }

  public execute(
    id: string,
    data: IUpdateClienteDTO,
    prestadorId: string
  ): ICliente {
    const validatedData = UpdateClienteSchema.parse(data);

    const clienteExistente = this.repository.findById(id, prestadorId);
    if (!clienteExistente) {
      throw new Error("Cliente não encontrado.");
    }

    const clienteAtualizado: ICliente = {
      ...clienteExistente,
      ...validatedData,
      email:
        validatedData.email === ""
          ? undefined
          : validatedData.email || clienteExistente.email,
      notas:
        validatedData.notas === ""
          ? undefined
          : validatedData.notas || clienteExistente.notas,
    } as ICliente;

    // Persiste as alterações usando o método já existente do repositório
    const changes = this.repository.update(id, prestadorId, clienteAtualizado);
    if (typeof changes === "number" && changes === 0) {
      throw new Error("Cliente não encontrado.");
    }

    // Recarrega o cliente do repositório para garantir que qualquer
    // normalização aplicada (por ex: telefone) seja refletida no retorno.
    const clientePersistido = this.repository.findById(id, prestadorId);
    if (!clientePersistido) {
      throw new Error("Cliente não encontrado.");
    }

    // Garantir que o telefone retornado esteja no formato normalizado (idempotente)
    if (clientePersistido.telefone) {
      clientePersistido.telefone = normalizePhoneBR(
        clientePersistido.telefone as string
      ) as string;
    }

    return clientePersistido;
  }
}
