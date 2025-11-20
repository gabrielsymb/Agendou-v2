import { randomUUID } from 'crypto';
import path from 'path';

// Import repositories (TypeScript)
import { ClienteRepository } from '../persistence/ClienteRepository';
import { ServicoRepository } from '../persistence/ServicoRepository';
import { AgendamentoRepository } from '../persistence/AgendamentoRepository';
import { PrestadorRepository } from '../persistence/PrestadorRepository';
import { initializeDatabase } from '../database';

function nowIsoPlus(minutes: number) {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
}

async function main() {
  // garante que o schema/tables existam
  try {
    initializeDatabase();
  } catch (err) {
    console.error('Falha ao inicializar o DB antes do seed:', err);
    throw err;
  }
  const clientesRepo = new ClienteRepository();
  const servicosRepo = new ServicoRepository();
  const agRepo = new AgendamentoRepository();
  const prestadorRepo = new PrestadorRepository();

  const prestadorId = 'prestador-seed-1';

  // Criar ou garantir prestador + licença (necessário para FK)
  const existingPrestador = prestadorRepo.findById(prestadorId);
  if (!existingPrestador) {
    const prestador = {
      id: prestadorId,
      nome: 'Prestador Seed',
      email: 'seed@local.test',
      senhaHash: 'seed-hash'
    };
    const licenca = {
      id: randomUUID(),
      prestadorId: prestadorId,
      tipoLicenca: 'mensal',
      chaveAleatoria: randomUUID(),
      dataInicio: new Date().toISOString(),
      dataFim: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
      ativa: true
    };
    prestadorRepo.createWithLicenca(prestador as any, licenca as any);
    console.log('Prestador seed criado.');
  }

  // Verifica se já existe algum cliente (evita duplicação)
  const existingClientes = clientesRepo.findAllByPrestadorId(prestadorId);
  if (existingClientes && existingClientes.length > 0) {
    console.log('DB já possui clientes; seed abortado.');
    return;
  }

  console.log('Populando DB de teste...');

  // Criar clientes
  const clientes = [
    { id: randomUUID(), prestadorId, nome: 'Maria Silva', telefone: '81999990001' },
    { id: randomUUID(), prestadorId, nome: 'João Pereira', telefone: '81999990002' },
    { id: randomUUID(), prestadorId, nome: 'Ana Costa', telefone: '81999990003' },
  ];
  clientes.forEach(c => clientesRepo.create(c as any));

  // Criar servicos
  const servicos = [
    { id: randomUUID(), prestadorId, nome: 'Corte', duracaoMinutos: 30, preco: 50.0, posicao: 1 },
    { id: randomUUID(), prestadorId, nome: 'Barba', duracaoMinutos: 20, preco: 30.0, posicao: 2 },
    { id: randomUUID(), prestadorId, nome: 'Cabelo & Barba', duracaoMinutos: 50, preco: 75.0, posicao: 3 },
  ];
  servicos.forEach(s => servicosRepo.create(s as any));

  // Criar alguns agendamentos para hoje
  const start = new Date();
  start.setHours(9, 0, 0, 0);

  const agendamentos = [] as any[];
  for (let i = 0; i < 8; i++) {
    const cliente = clientes[i % clientes.length];
    const servico = servicos[i % servicos.length];
    const inicio = new Date(start.getTime() + i * 30 * 60000);
    const fim = new Date(inicio.getTime() + servico.duracaoMinutos * 60000);
    agendamentos.push({
      id: randomUUID(),
      prestadorId,
      clienteId: cliente.id,
      servicoId: servico.id,
      dataHoraInicio: inicio.toISOString(),
      dataHoraFim: fim.toISOString(),
      status: 'Agendado',
      posicao: i
    });
  }

  agendamentos.forEach(a => agRepo.create(a));

  console.log('Seed finalizado com sucesso');
}

main().catch(err => {
  console.error('Seed falhou:', err);
  process.exit(1);
});
