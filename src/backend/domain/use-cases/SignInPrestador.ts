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

    // DEBUG: log incoming email for troubleshooting login issues (only with DEBUG=1)
  try {
    const debug = (process.env.DEBUG || '').toString() === '1';
    if (debug) console.log('[SignInPrestador] attempt email=', validatedData.email);
  } catch(e) {}

    const prestador = this.repository.findByEmail(validatedData.email);
  try {
    const debug = (process.env.DEBUG || '').toString() === '1';
    if (debug) console.log('[SignInPrestador] prestador found=', Boolean(prestador), prestador && { id: prestador.id, email: prestador.email });
  } catch(e) {}

    if (!prestador) {
      throw new Error("Credenciais inválidas. Verifique e-mail e senha.");
    }

    const isPasswordValid = await bcrypt.compare(
      validatedData.senha,
      prestador.senhaHash
    );
  try {
    const debug = (process.env.DEBUG || '').toString() === '1';
    if (debug) console.log('[SignInPrestador] bcrypt.compare result=', isPasswordValid);
  } catch(e) {}

    if (!isPasswordValid) {
      throw new Error("Credenciais inválidas. Verifique e-mail e senha.");
    }

    const { senhaHash: _, ...prestadorRetorno } = prestador as any;
    return prestadorRetorno as Omit<IPrestador, "senhaHash">;
  }
}
