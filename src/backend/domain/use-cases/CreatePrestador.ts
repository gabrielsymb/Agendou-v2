import { z } from "zod";
import { IPrestador } from "../../../shared/entities";
import { PrestadorRepository } from "../../../backend/persistence/PrestadorRepository";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

export const CreatePrestadorSchema = z.object({
  nome: z.string().min(3, "O nome deve ter no mínimo 3 caracteres."),
  email: z
    .string()
    .email("Formato de e-mail inválido.")
    .transform((s) => s.toLowerCase()),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

export type ICreatePrestadorDTO = z.infer<typeof CreatePrestadorSchema>;

export class CreatePrestador {
  private repository: PrestadorRepository;
  private saltRounds = 10;

  constructor() {
    this.repository = new PrestadorRepository();
  }

  public async execute(
    data: ICreatePrestadorDTO
  ): Promise<Omit<IPrestador, "senhaHash">> {
    const validatedData = CreatePrestadorSchema.parse(data);

    if (this.repository.findByEmail(validatedData.email)) {
      throw new Error("E-mail já registrado.");
    }

    const senhaHash = await bcrypt.hash(validatedData.senha, this.saltRounds);

    const id = uuidv4();
    const novoPrestador: IPrestador = {
      id,
      prestadorId: id,
      nome: validatedData.nome,
      email: validatedData.email,
      senhaHash,
    };

    this.repository.create(novoPrestador);

    const { senhaHash: _, ...prestadorRetorno } = novoPrestador;
    return prestadorRetorno;
  }
}
