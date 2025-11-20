import bcrypt from 'bcrypt';
import { PrestadorRepository } from '../persistence/PrestadorRepository';
import { randomBytes } from 'crypto';

function genPassword(len = 10){
  return randomBytes(len).toString('base64').replace(/[+/=]/g,'').slice(0,len);
}

async function main(){
  const password = genPassword(10);
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  const repo = new PrestadorRepository();
  const id = 'prestador-seed-1';
  const existing = repo.findById(id);
  if(!existing){
    console.error('Prestador seed não encontrado. Rode o seed primeiro.');
    process.exit(1);
  }
  const changes = repo.update(id, { senhaHash: hash } as any);
  console.log('Senha atualizada para prestador-seed-1. changes=', changes);
  console.log('Nova senha (use esta no login):', password);
}

main().catch(err => { console.error(err); process.exit(1); });
