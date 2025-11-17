import { prepareTestDatabase, cleanupTestDatabase } from "./testDatabase";
import { randomUUID } from "crypto";

beforeAll(() => {
  prepareTestDatabase();
});

afterAll(() => {
  cleanupTestDatabase();
});

test("cria cliente com sucesso", () => {
  // require dinâmico após preparar o DB
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { CreateCliente } = require("../domain/use-cases/CreateCliente");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { ClienteRepository } = require("../persistence/ClienteRepository");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { PrestadorRepository } = require("../persistence/PrestadorRepository");

  const prestadorRepo = new PrestadorRepository();
  const prestadorId = randomUUID();
  prestadorRepo.create({
    id: prestadorId,
    nome: "Teste",
    email: `${prestadorId}@example.com`,
    senhaHash: "x",
  });

  const create = new CreateCliente();
  const payload = {
    prestadorId,
    nome: "Maria Silva",
    telefone: "81984070337",
    email: "maria@example.com",
    notas: "Cliente VIP",
  } as any;

  const result = create.execute(payload);
  expect(result).toBeDefined();
  const cliente = (result as any).cliente;
  expect(cliente.id).toBeTruthy();
  expect(cliente.prestadorId).toBe(prestadorId);

  const repo = new ClienteRepository();
  const found = repo.findById(cliente.id, prestadorId);
  expect(found).toBeDefined();
  expect(found?.nome).toBe("Maria Silva");
});
