import { getDbInstance } from "../database";
import { ICliente } from "../../shared/entities";
import Database from "better-sqlite3";
import { randomUUID } from "crypto";
import { normalizePhoneBR } from "../utils/phone";

export class ClienteRepository {
  private db: Database.Database;

  constructor() {
    this.db = getDbInstance();
  }

  /**
   * Busca um cliente pelo ID, GARANTINDO que ele pertence ao prestador logado.
   */
  public findById(id: string, prestadorId: string): ICliente | undefined {
    const stmt = this.db.prepare(
      "SELECT * FROM clientes WHERE id = ? AND prestadorId = ?"
    );
    const cliente = stmt.get(id, prestadorId);
    return cliente as ICliente | undefined;
  }

  /**
   * Lista todos os clientes para um prestador específico.
   */
  public findAllByPrestadorId(prestadorId: string): ICliente[] {
    // Ordena por nome para facilitar a busca no frontend
    const stmt = this.db.prepare(
      "SELECT * FROM clientes WHERE prestadorId = ? ORDER BY nome ASC"
    );
    const clientes = stmt.all(prestadorId);
    return clientes as ICliente[];
  }

  /**
   * Cria um novo Cliente no banco de dados.
   */
  public create(cliente: ICliente): void {
    const stmt = this.db.prepare(`
            INSERT INTO clientes (id, prestadorId, nome, telefone, email, notas)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
    stmt.run(
      cliente.id,
      cliente.prestadorId,
      cliente.nome,
      cliente.telefone,
      cliente.email || null, // Garante que o campo opcional seja NULL se vazio
      cliente.notas || null
    );
  }

  /**
   * Atualiza um cliente (somente campos permitidos).
   */
  public update(
    id: string,
    prestadorId: string,
    patch: Partial<ICliente>
  ): number {
    const existing = this.findById(id, prestadorId);
    if (!existing) return 0;

    const updated = { ...existing, ...patch } as ICliente;

    // Normaliza telefone antes de atualizar, se fornecido
    if (patch.telefone) {
      const normalized = normalizePhoneBR(patch.telefone as string);
      if (!normalized)
        throw new Error(
          "Telefone inválido. Envie um número válido (ex: 81984070337)"
        );
      updated.telefone = normalized;
    }

    const stmt = this.db.prepare(`
            UPDATE clientes SET nome = ?, telefone = ?, email = ?, notas = ? WHERE id = ? AND prestadorId = ?
        `);
    const info = stmt.run(
      updated.nome,
      updated.telefone || null,
      updated.email || null,
      updated.notas || null,
      id,
      prestadorId
    );
    return info.changes;
  }

  /**
   * Deleta um cliente garantindo o prestador.
   */
  public delete(id: string, prestadorId: string): number {
    const stmt = this.db.prepare(
      "DELETE FROM clientes WHERE id = ? AND prestadorId = ?"
    );
    const info = stmt.run(id, prestadorId);
    return info.changes;
  }

  /**
   * Busca clientes por nome ou telefone com limite de resultados (para autocomplete).
   * @param query Termo de busca (ex: 'Maria' ou '9987').
   * @param prestadorId ID do prestador logado.
   * @param limit Número máximo de resultados.
   */
  public searchByQuery(
    query: string,
    prestadorId: string,
    limit: number
  ): Array<{ id: string; nome: string }> {
    const searchTerm = `%${query.toLowerCase()}%`;
    const stmt = this.db.prepare(`
            SELECT id, nome FROM clientes 
            WHERE prestadorId = ? 
              AND (
                LOWER(nome) LIKE ? 
                OR telefone LIKE ?
              )
            ORDER BY nome ASC
            LIMIT ?
        `);
    const clientes = stmt.all(prestadorId, searchTerm, searchTerm, limit);
    return clientes as Array<{ id: string; nome: string }>;
  }
}
