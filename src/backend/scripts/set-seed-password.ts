import bcrypt from 'bcrypt';
import { PrestadorRepository } from '../persistence/PrestadorRepository';

async function main() {
  const arg = process.argv[2];
  if (!arg) {
    console.error('Usage: ts-node-dev ./src/backend/scripts/set-seed-password.ts <new-password>');
    process.exit(1);
  }
  const password = String(arg);
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);

  const repo = new PrestadorRepository();
  const id = 'prestador-seed-1';
  const existing = repo.findById(id);
  if (!existing) {
    console.error('Prestador seed não encontrado. Rode o seed primeiro.');
    process.exit(1);
  }

  const changes = repo.update(id, { senhaHash: hash } as any);
  console.log('Senha atualizada para prestador-seed-1. changes=', changes);
}

main().catch(err => { console.error(err); process.exit(1); });
