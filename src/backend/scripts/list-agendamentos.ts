import { PrestadorRepository } from '../persistence/PrestadorRepository';
import { AgendamentoRepository } from '../persistence/AgendamentoRepository';

async function main(){
  const arg = process.argv[2];
  const dateArg = process.argv[3];
  if(!arg){
    console.error('Usage: ts-node src/backend/scripts/list-agendamentos.ts <prestador-email|prestador-id> [YYYY-MM-DD]');
    process.exit(1);
  }
  const prestRepo = new PrestadorRepository();
  const agRepo = new AgendamentoRepository();
  let prest:any;
  if(arg.includes('@')) prest = prestRepo.findByEmail(arg.toLowerCase());
  else prest = prestRepo.findById(arg);
  if(!prest){
    console.error('Prestador não encontrado para', arg);
    process.exit(2);
  }

  const day = dateArg || new Date().toISOString().substring(0,10);
  const start = new Date(day + 'T00:00:00.000Z').toISOString();
  const end = new Date(day + 'T23:59:59.999Z').toISOString();
  const rows = agRepo.findByDay(prest.id, start, end);
  console.log('Prestador:', prest.id, prest.email, 'agendamentos on', day, '=', rows.length);
  console.table(rows.map(r => ({ id: r.id, cliente: r.clienteNome, servico: r.servicoNome, inicio: r.dataHoraInicio, status: r.status })));
}

main().catch(e=>{ console.error(e); process.exit(1); });
