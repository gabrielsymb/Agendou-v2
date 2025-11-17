import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const TEMPLATE_DB = path.resolve(
  __dirname,
  "../../../data/test-template.sqlite"
);
const WORK_DB = path.resolve(__dirname, "../../../data/test.sqlite");

// Cria um DB de teste limpo copiando um template. Se não existir template, usa o init do app
export function prepareTestDatabase() {
  // Garantir pasta data
  const dataDir = path.resolve(__dirname, "../../../data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  // Se existir template, copie; senão, inicialize criando um arquivo vazio e executando a inicialização via script
  if (fs.existsSync(TEMPLATE_DB)) {
    fs.copyFileSync(TEMPLATE_DB, WORK_DB);
  } else {
    // Cria arquivo vazio e deixamos que o código do projeto inicialize as tabelas quando aberto
    if (!fs.existsSync(WORK_DB)) fs.writeFileSync(WORK_DB, "");
  }

  // Ajusta variável de ambiente esperada pelo app
  process.env.DB_PATH = WORK_DB;
  // Importa o módulo de database e inicializa as tabelas para garantir que
  // o DB de teste tenha o schema necessário antes dos testes rodarem.
  // Usamos require here para que respeite o `process.env.DB_PATH` que acabamos de setar.
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const dbModule = require("../database");
    if (dbModule && typeof dbModule.initializeDatabase === "function") {
      dbModule.initializeDatabase();
    }
  } catch (err) {
    // Se houver um problema ao inicializar, deixamos que os testes falhem com detalhes.
    console.warn("Aviso: falha ao inicializar DB de teste:", err);
  }
}

export function cleanupTestDatabase() {
  try {
    if (fs.existsSync(WORK_DB)) fs.unlinkSync(WORK_DB);
  } catch (err) {
    // ignore
  }
}
