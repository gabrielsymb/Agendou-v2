import { getDbInstance } from "../database/index";
import { IServico } from "../../shared/entities";

export class ServicoRepository {
  private db = getDbInstance();

  create(servico: IServico) {
    const stmt = this.db.prepare(
      `INSERT INTO servicos (id, prestadorId, nome, duracaoMinutos, preco, posicao) VALUES (?, ?, ?, ?, ?, ?)`
    );
    const info = stmt.run(
      servico.id,
      servico.prestadorId,
      servico.nome,
      servico.duracaoMinutos,
      servico.preco,
      servico.posicao
    );
    return info.changes;
  }

  // Calcula a próxima posição disponível para um prestador
  getNextPosicao(prestadorId: string): number {
    const row = this.db
      .prepare(
        `SELECT MAX(posicao) as maxPos FROM servicos WHERE prestadorId = ?`
      )
      .get(prestadorId) as { maxPos?: number } | undefined;
    const maxPos = row && row.maxPos != null ? Number(row.maxPos) : 0;
    return maxPos + 1;
  }

  findAllByPrestadorId(prestadorId: string): IServico[] {
    const stmt = this.db.prepare(
      `SELECT id, prestadorId, nome, duracaoMinutos, preco, posicao FROM servicos WHERE prestadorId = ? ORDER BY posicao ASC`
    );
    return stmt.all(prestadorId) as IServico[];
  }

  findById(id: string) {
    const stmt = this.db.prepare(
      `SELECT id, prestadorId, nome, duracaoMinutos, preco, posicao FROM servicos WHERE id = ?`
    );
    return stmt.get(id) as IServico | undefined;
  }

  update(id: string, prestadorId: string, patch: Partial<IServico>) {
    // build dynamic update
    const fields: string[] = [];
    const values: any[] = [];
    if (patch.nome !== undefined) {
      fields.push("nome = ?");
      values.push(patch.nome);
    }
    if (patch.duracaoMinutos !== undefined) {
      fields.push("duracaoMinutos = ?");
      values.push(patch.duracaoMinutos);
    }
    if (patch.preco !== undefined) {
      fields.push("preco = ?");
      values.push(patch.preco);
    }
    if (patch.posicao !== undefined) {
      fields.push("posicao = ?");
      values.push(patch.posicao);
    }

    if (fields.length === 0) return 0;

    const sql = `UPDATE servicos SET ${fields.join(
      ", "
    )} WHERE id = ? AND prestadorId = ?`;
    values.push(id, prestadorId);
    const stmt = this.db.prepare(sql);
    const info = stmt.run(...values);
    return info.changes;
  }

  delete(id: string, prestadorId: string) {
    const stmt = this.db.prepare(
      `DELETE FROM servicos WHERE id = ? AND prestadorId = ?`
    );
    const info = stmt.run(id, prestadorId);
    return info.changes;
  }
}
