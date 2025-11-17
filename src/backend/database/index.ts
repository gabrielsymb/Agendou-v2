import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Pega o caminho do banco de dados da variável de ambiente (DB_PATH=/data/agenda.sqlite no Fly)
const DB_PATH = process.env.DB_PATH || "/data/agenda.sqlite";

// Cria o caminho absoluto para garantir a consistência
const dbPathAbsolute = path.resolve(DB_PATH);

// Garante que o diretório onde o arquivo do DB ficará exista antes de abrir o DB
const dbDir = path.dirname(dbPathAbsolute);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Cria a instância do banco de dados
const db = new Database(dbPathAbsolute, { verbose: console.log });

/**
 * Função para inicializar as tabelas do banco de dados (Migrations iniciais).
 */
export function initializeDatabase() {
  console.log(`\n Inicializando banco de dados em: ${dbPathAbsolute}`);

  // O diretório já é garantido na inicialização do módulo.

  // --- 1. Tabela PRESTADORES (Auth Core) ---
  db.exec(`
        CREATE TABLE IF NOT EXISTS prestadores (
            id TEXT PRIMARY KEY,
            nome TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            senhaHash TEXT NOT NULL
        );
    `);

  // --- 2. Tabela LICENÇAS (Monetização Core) ---
  db.exec(`
        CREATE TABLE IF NOT EXISTS licenca (
            id TEXT PRIMARY KEY,
            prestadorId TEXT NOT NULL,
            tipoLicenca TEXT NOT NULL,
            chaveAleatoria TEXT UNIQUE NOT NULL,
            dataInicio DATETIME NOT NULL,
            dataFim DATETIME NOT NULL,
            ativa BOOLEAN NOT NULL DEFAULT 1,
            FOREIGN KEY(prestadorId) REFERENCES prestadores(id)
        );
        CREATE INDEX IF NOT EXISTS idx_licenca_prestadorId ON licenca (prestadorId);
    `);

  // --- 3. Tabela CLIENTES ---
  db.exec(`
        CREATE TABLE IF NOT EXISTS clientes (
            id TEXT PRIMARY KEY,
            prestadorId TEXT NOT NULL,
            nome TEXT NOT NULL,
            telefone TEXT NOT NULL,
            email TEXT,
            notas TEXT,
            FOREIGN KEY(prestadorId) REFERENCES prestadores(id)
        );
        CREATE INDEX IF NOT EXISTS idx_clientes_prestadorId ON clientes (prestadorId);
    `);

  // Índice para busca case-insensitive em nome (melhora performance de autocomplete)
  db.exec(
    `CREATE INDEX IF NOT EXISTS idx_clientes_nome_lower ON clientes (LOWER(nome));`
  );

  // --- 4. Tabela SERVIÇOS ---
  db.exec(`
        CREATE TABLE IF NOT EXISTS servicos (
            id TEXT PRIMARY KEY,
            prestadorId TEXT NOT NULL,
            nome TEXT NOT NULL,
            duracaoMinutos INTEGER NOT NULL,
            preco REAL NOT NULL,
      posicao INTEGER NOT NULL,
            FOREIGN KEY(prestadorId) REFERENCES prestadores(id)
        );
    CREATE INDEX IF NOT EXISTS idx_servicos_prestadorId ON servicos (prestadorId);
    CREATE INDEX IF NOT EXISTS idx_servicos_prestador_posicao ON servicos (prestadorId, posicao);
    `);

  // --- 5. Tabela AGENDAMENTOS (Domínio Crítico) ---
  db.exec(`
        CREATE TABLE IF NOT EXISTS agendamentos (
            id TEXT PRIMARY KEY,
            prestadorId TEXT NOT NULL,
            clienteId TEXT NOT NULL,
            servicoId TEXT NOT NULL,
            dataHoraInicio DATETIME NOT NULL,
            dataHoraFim DATETIME NOT NULL,
            status TEXT NOT NULL,
            posicao REAL NOT NULL,
            FOREIGN KEY(prestadorId) REFERENCES prestadores(id),
            FOREIGN KEY(clienteId) REFERENCES clientes(id),
            FOREIGN KEY(servicoId) REFERENCES servicos(id)
        );
        -- Índice CRÍTICO para a tela de agenda
        CREATE INDEX IF NOT EXISTS idx_agendamentos_prestador_data ON agendamentos (prestadorId, dataHoraInicio);
    `);

  console.log("Tabelas verificadas e/ou criadas com sucesso!");
}

/**
 * Retorna a instância ativa do banco de dados (usada pelos Repositórios).
 */
export function getDbInstance(): InstanceType<typeof Database> {
  return db;
}
