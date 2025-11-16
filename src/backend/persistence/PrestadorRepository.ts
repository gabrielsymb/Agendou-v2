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

  // Futuros métodos: update, delete, listByPrestadorId etc.
}
