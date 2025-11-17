import { z } from "zod";
import { IPrestador, ILicenca } from "../../../shared/entities";
import { PrestadorRepository } from "../../persistence/PrestadorRepository";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const SALT_ROUNDS = 10;

export const RegisterPrestadorSchema = z.object({
  nome: z.string().min(3).max(100),
  email: z.string().email("Email inválido."),
  senha: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
});

export type IRegisterPrestadorDTO = z.infer<typeof RegisterPrestadorSchema>;

export class RegisterPrestador {
  private repository: PrestadorRepository;

  constructor() {
    this.repository = new PrestadorRepository();
  }

  public execute(data: IRegisterPrestadorDTO): Omit<IPrestador, "senhaHash"> {
    const validatedData = RegisterPrestadorSchema.parse(data);

    if (this.repository.findByEmail(validatedData.email)) {
      throw new Error("Este email já está cadastrado.");
    }

    const senhaHash = bcrypt.hashSync(validatedData.senha, SALT_ROUNDS);

    const prestadorId = uuidv4();
    const dataInicio = dayjs.utc().toISOString();
    const dataFim = dayjs.utc().add(7, "day").toISOString();

    const novoPrestador: IPrestador = {
      id: prestadorId,
      prestadorId: prestadorId,
      nome: validatedData.nome,
      email: validatedData.email,
      senhaHash,
    };

    const novaLicenca: ILicenca = {
      id: uuidv4(),
      prestadorId: prestadorId,
      tipoLicenca: "semanal",
      chaveAleatoria: uuidv4(),
      dataInicio: dataInicio,
      dataFim: dataFim,
      ativa: true,
    };

    this.repository.createWithLicenca(novoPrestador, novaLicenca as any);

    const { senhaHash: _, ...prestadorToReturn } = novoPrestador;
    return prestadorToReturn;
  }
}
