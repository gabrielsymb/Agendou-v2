import { prepareTestDatabase, cleanupTestDatabase } from "./testDatabase";
import { randomUUID } from "crypto";

beforeAll(() => {
  prepareTestDatabase();
});

afterAll(() => {
  cleanupTestDatabase();
});

test("deleta cliente com sucesso", () => {
  // require dinâmico após preparar o DB
  let CreateCliente: any;
  let DeleteCliente: any;
  let ClienteRepository: any;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ({ CreateCliente } = require("../domain/use-cases/CreateCliente"));
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ({ DeleteCliente } = require("../domain/use-cases/DeleteCliente"));
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
    nome: "Carlos",
    telefone: "81984070338",
  } as any);
  const cliente = (result as any).cliente;

  const repo = new ClienteRepository();
  const found = repo.findById(cliente.id, prestadorId);
  expect(found).toBeDefined();

  const del = new DeleteCliente();
  del.execute(cliente.id, prestadorId);

  const after = repo.findById(cliente.id, prestadorId);
  expect(after).toBeUndefined();
});
