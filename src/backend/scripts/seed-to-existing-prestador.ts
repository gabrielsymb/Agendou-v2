import { PrestadorRepository } from '../persistence/PrestadorRepository';
import { ClienteRepository } from '../persistence/ClienteRepository';
import { ServicoRepository } from '../persistence/ServicoRepository';
import { AgendamentoRepository } from '../persistence/AgendamentoRepository';
import { randomUUID } from 'crypto';

async function main(){
  const email = process.argv[2];
  if(!email){
    console.error('Usage: ts-node src/backend/scripts/seed-to-existing-prestador.ts <email>');
    process.exit(1);
  }

  const prestRepo = new PrestadorRepository();
  const prest = prestRepo.findByEmail(email.toLowerCase());
  if(!prest){
    console.error('Prestador não encontrado para email=', email);
    process.exit(2);
  }

  const clienteRepo = new ClienteRepository();
  const servRepo = new ServicoRepository();
  const agRepo = new AgendamentoRepository();

  // Create sample clients
  const clientes = [
    { id: randomUUID(), prestadorId: prest.id, nome: 'Cliente A', telefone: '81999990001' },
    { id: randomUUID(), prestadorId: prest.id, nome: 'Cliente B', telefone: '81999990002' },
    { id: randomUUID(), prestadorId: prest.id, nome: 'Cliente C', telefone: '81999990003' },
  ];
  clientes.forEach(c => clienteRepo.create(c as any));

  // Create sample services
  const servicos = [
    { id: randomUUID(), prestadorId: prest.id, nome: 'Corte', duracaoMinutos: 30, preco: 40, posicao: servRepo.getNextPosicao(prest.id) },
    { id: randomUUID(), prestadorId: prest.id, nome: 'Barba', duracaoMinutos: 20, preco: 25, posicao: servRepo.getNextPosicao(prest.id) },
  ];
  servicos.forEach(s => servRepo.create(s as any));

  // Create agendamentos for today
  const startDate = new Date();
  startDate.setHours(9,0,0,0);
  const agendamentos = [] as any[];
  for(let i=0;i<6;i++){
    const cliente = clientes[i % clientes.length];
    const serv = servicos[i % servicos.length];
    const inicio = new Date(startDate.getTime() + i*30*60000);
    const fim = new Date(inicio.getTime() + (serv.duracaoMinutos || 30)*60000);
    agendamentos.push({
      id: randomUUID(),
      prestadorId: prest.id,
      clienteId: cliente.id,
      servicoId: serv.id,
      dataHoraInicio: inicio.toISOString(),
      dataHoraFim: fim.toISOString(),
      status: 'Agendado',
      posicao: i+1
    });
  }

  agendamentos.forEach(a => agRepo.create(a));

  console.log('Seed aplicada para prestador', prest.id, 'clientes=', clientes.length, 'servicos=', servicos.length, 'agendamentos=', agendamentos.length);
}

main().catch(err => { console.error(err); process.exit(1); });
