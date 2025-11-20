import { PrestadorRepository } from '../persistence/PrestadorRepository';
import { ServicoRepository } from '../persistence/ServicoRepository';

async function main(){
  const arg = process.argv[2];
  if(!arg){
    console.error('Usage: ts-node src/backend/scripts/list-servicos.ts <prestador-email|prestador-id>');
    process.exit(1);
  }
  const prestRepo = new PrestadorRepository();
  const servRepo = new ServicoRepository();
  let prest:any;
  if(arg.includes('@')) prest = prestRepo.findByEmail(arg.toLowerCase());
  else prest = prestRepo.findById(arg);
  if(!prest){
    console.error('Prestador não encontrado para', arg);
    process.exit(2);
  }
  const rows = servRepo.findAllByPrestadorId(prest.id);
  console.log('Prestador:', prest.id, prest.email, 'servicos=', rows.length);
  console.table(rows.map(r => ({ id: r.id, nome: r.nome, duracao: r.duracaoMinutos, preco: r.preco })));
}

main().catch(e=>{ console.error(e); process.exit(1); });
