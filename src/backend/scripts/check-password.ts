import { PrestadorRepository } from '../persistence/PrestadorRepository';
import bcrypt from 'bcrypt';

async function main() {
  const email = process.argv[2];
  const pwd = process.argv[3];
  if (!email || !pwd) {
    console.error('Usage: ts-node-dev ./src/backend/scripts/check-password.ts <email> <password>');
    process.exit(1);
  }
  const repo = new PrestadorRepository();
  // find prestador by email
  const p = repo.findByEmail(email.toLowerCase());
  if (!p) {
    console.error('Prestador não encontrado para email=', email);
    process.exit(2);
  }
  console.log('Found prestador id=', p.id, 'email=', p.email, 'senhaHash=', p.senhaHash);
  const ok = await bcrypt.compare(pwd, p.senhaHash);
  console.log('bcrypt.compare result for', pwd, ':', ok);
}

main().catch(err => { console.error(err); process.exit(1); });
