import { prepareTestDatabase, cleanupTestDatabase } from "./testDatabase";
import { randomUUID } from "crypto";

beforeAll(() => {
  prepareTestDatabase();
});

afterAll(() => {
  cleanupTestDatabase();
});

test("atualiza cliente nome e telefone", () => {
  // require dinâmico após preparar o DB
  // declaramos variáveis para satisfazer o TypeScript LSP
  let CreateCliente: any;
  let UpdateCliente: any;
  let ClienteRepository: any;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ({ CreateCliente } = require("../domain/use-cases/CreateCliente"));
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ({ UpdateCliente } = require("../domain/use-cases/UpdateCliente"));
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ({ ClienteRepository } = require("../persistence/ClienteRepository"));

  const prestadorId = randomUUID();
  // Criar prestador para satisfazer FK
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrestadorRepository } = require("../persistence/PrestadorRepository");
  const prestadorRepo = new PrestadorRepository();
  prestadorRepo.create({
    id: prestadorId,
    nome: "Teste",
    email: `${prestadorId}@example.com`,
    senhaHash: "x",
  });
  const create = new CreateCliente();
  const result = create.execute({
    prestadorId,
    nome: "Joao",
    telefone: "81984070337",
  } as any);
  const cliente = (result as any).cliente;

  const update = new UpdateCliente();
  const updated = update.execute(
    cliente.id,
    { nome: "Joao Atualizado", telefone: "81999990000" },
    prestadorId
  );

  expect(updated.nome).toBe("Joao Atualizado");
  expect(updated.telefone).toMatch(/^55/);

  const repo = new ClienteRepository();
  const found = repo.findById(cliente.id, prestadorId);
  expect(found?.nome).toBe("Joao Atualizado");
});
