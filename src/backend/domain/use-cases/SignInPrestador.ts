import { z } from "zod";
import bcrypt from "bcrypt";
import { PrestadorRepository } from "../../persistence/PrestadorRepository";
import { IPrestador } from "../../../shared/entities";

export const SignInPrestadorSchema = z.object({
  email: z.string().email("Formato de e-mail inválido.").toLowerCase(),
  senha: z.string().min(1, "A senha é obrigatória."),
});

export type ISignInPrestadorDTO = z.infer<typeof SignInPrestadorSchema>;

export class SignInPrestador {
  private repository: PrestadorRepository;

  constructor() {
    this.repository = new PrestadorRepository();
  }

  public async execute(
    data: ISignInPrestadorDTO
  ): Promise<Omit<IPrestador, "senhaHash">> {
    const validatedData = SignInPrestadorSchema.parse(data);

    const prestador = this.repository.findByEmail(validatedData.email);

    if (!prestador) {
      throw new Error("Credenciais inválidas. Verifique e-mail e senha.");
    }

    const isPasswordValid = await bcrypt.compare(
      validatedData.senha,
      prestador.senhaHash
    );

    if (!isPasswordValid) {
      throw new Error("Credenciais inválidas. Verifique e-mail e senha.");
    }

    const { senhaHash: _, ...prestadorRetorno } = prestador as any;
    return prestadorRetorno as Omit<IPrestador, "senhaHash">;
  }
}
