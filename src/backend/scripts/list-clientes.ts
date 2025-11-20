import { PrestadorRepository } from '../persistence/PrestadorRepository';
import { ClienteRepository } from '../persistence/ClienteRepository';

async function main(){
  const arg = process.argv[2];
  if(!arg){
    console.error('Usage: ts-node src/backend/scripts/list-clientes.ts <prestador-email|prestador-id>');
    process.exit(1);
  }
  const prestRepo = new PrestadorRepository();
  const clienteRepo = new ClienteRepository();
  let prest:any;
  if(arg.includes('@')) prest = prestRepo.findByEmail(arg.toLowerCase());
  else prest = prestRepo.findById(arg);
  if(!prest){
    console.error('Prestador não encontrado para', arg);
    process.exit(2);
  }
  const rows = clienteRepo.findAllByPrestadorId(prest.id);
  console.log('Prestador:', prest.id, prest.email, 'clientes=', rows.length);
  console.table(rows.map(r => ({ id: r.id, nome: r.nome, telefone: r.telefone, email: r.email })));
}

main().catch(e=>{ console.error(e); process.exit(1); });
