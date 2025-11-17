import { getDbInstance } from "../database";
import { IPrestador } from "../../shared/entities";
import type BetterSqlite3 from "better-sqlite3";

export class PrestadorRepository {
  private db: BetterSqlite3.Database;

  constructor() {
    this.db = getDbInstance();
  }

  /**
   * Encontra um Prestador pelo ID.
   */
  public findById(id: string): IPrestador | undefined {
    const stmt = this.db.prepare("SELECT * FROM prestadores WHERE id = ?");
    const prestador = stmt.get(id);
    return prestador as IPrestador | undefined;
  }

  /**
   * Encontra um Prestador pelo Email (necessário para o Login).
   */
  public findByEmail(email: string): IPrestador | undefined {
    const stmt = this.db.prepare("SELECT * FROM prestadores WHERE email = ?");
    const prestador = stmt.get(email);
    return prestador as IPrestador | undefined;
  }

  /**
   * Cria um novo Prestador no banco de dados.
   */
  public create(prestador: IPrestador): void {
    const stmt = this.db.prepare(`
            INSERT INTO prestadores (id, nome, email, senhaHash)
            VALUES (?, ?, ?, ?)
        `);
    stmt.run(
      prestador.id,
      prestador.nome,
      prestador.email,
      prestador.senhaHash
    );
  }

  /**
   * Cria um prestador e uma licença inicial dentro de uma transação.
   */
  public createWithLicenca(prestador: IPrestador, licenca: any): void {
    const createPrestadorStmt = this.db.prepare(`
            INSERT INTO prestadores (id, nome, email, senhaHash)
            VALUES (?, ?, ?, ?)
        `);

    const createLicencaStmt = this.db.prepare(`
            INSERT INTO licenca (id, prestadorId, tipoLicenca, chaveAleatoria, dataInicio, dataFim, ativa)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

    const runTransaction = this.db.transaction(() => {
      createPrestadorStmt.run(
        prestador.id,
        prestador.nome,
        prestador.email,
        prestador.senhaHash
      );
      createLicencaStmt.run(
        licenca.id,
        licenca.prestadorId,
        licenca.tipoLicenca,
        licenca.chaveAleatoria,
        licenca.dataInicio,
        licenca.dataFim,
        licenca.ativa
      );
    });

    runTransaction();
  }

  // Futuros métodos: update, delete, listByPrestadorId etc.
}
