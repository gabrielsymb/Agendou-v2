const { randomUUID } = require('crypto');
const path = require('path');

// Ajuste de paths conforme estrutura do projeto
const repoRoot = path.resolve(__dirname, '..');
const persistencePath = path.join(repoRoot, '..', 'persistence');

// Importar repositórios (CommonJS require)
const { ClienteRepository } = require(path.join(__dirname, '..', '..', 'persistence', 'ClienteRepository'));
const { ServicoRepository } = require(path.join(__dirname, '..', '..', 'persistence', 'ServicoRepository'));
const { AgendamentoRepository } = require(path.join(__dirname, '..', '..', 'persistence', 'AgendamentoRepository'));

function nowIsoPlus(minutes) {
  const d = new Date();
  d.setMinutes(d.getMinutes() + minutes);
  return d.toISOString();
}

async function main() {
  const clientesRepo = new ClienteRepository();
  const servicosRepo = new ServicoRepository();
  const agRepo = new AgendamentoRepository();

  // Prestador fixo para seed (ajuste se necessário)
  const prestadorId = 'prestador-seed-1';

  // Verifica se já existe algum cliente
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
  clientes.forEach(c => clientesRepo.create(c));

  // Criar servicos
  const servicos = [
    { id: randomUUID(), prestadorId, nome: 'Corte', duracaoMinutos: 30, preco: 50.0, posicao: 1 },
    { id: randomUUID(), prestadorId, nome: 'Barba', duracaoMinutos: 20, preco: 30.0, posicao: 2 },
    { id: randomUUID(), prestadorId, nome: 'Cabelo & Barba', duracaoMinutos: 50, preco: 75.0, posicao: 3 },
  ];
  servicos.forEach(s => servicosRepo.create(s));

  // Criar alguns agendamentos para hoje
  const start = new Date();
  start.setHours(9, 0, 0, 0);

  const agendamentos = [];
  for (let i = 0; i < 6; i++) {
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
