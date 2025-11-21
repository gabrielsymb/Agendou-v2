import { randomUUID } from 'crypto';
import { initializeDatabase } from '../database';
import { PrestadorRepository } from '../persistence/PrestadorRepository';
import { ClienteRepository } from '../persistence/ClienteRepository';
import { ServicoRepository } from '../persistence/ServicoRepository';
import { AgendamentoRepository } from '../persistence/AgendamentoRepository';

async function main() {
  try {
    initializeDatabase();
  } catch (err) {
    console.error('Falha ao inicializar o DB antes do seed:', err);
    throw err;
  }

  const prestRepo = new PrestadorRepository();
  const clienteRepo = new ClienteRepository();
  const servRepo = new ServicoRepository();
  const agRepo = new AgendamentoRepository();

  const prestadorEmail = 'seed@local.test';
  const prestadorId = 'prestador-seed-1';

  // Garantir prestador
  let prest = prestRepo.findByEmail(prestadorEmail);
  if (!prest) {
    const prestador = {
      id: prestadorId,
      nome: 'Prestador Seed',
      email: prestadorEmail,
      senhaHash: 'seed-hash'
    } as any;
    // createWithLicenca if available, otherwise create minimal
    try {
      if (typeof (prestRepo as any).createWithLicenca === 'function') {
        const licenca = {
          id: randomUUID(),
          prestadorId,
          tipoLicenca: 'mensal',
          chaveAleatoria: randomUUID(),
          dataInicio: new Date().toISOString(),
          dataFim: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
          ativa: true
        } as any;
        (prestRepo as any).createWithLicenca(prestador, licenca);
      } else {
        (prestRepo as any).create(prestador);
      }
      console.log('Prestador seed criado.');
    } catch (e) {
      console.error('Erro ao criar prestador seed:', e);
      throw e;
    }
    prest = prestRepo.findByEmail(prestadorEmail);
    if (!prest) {
      console.error('Erro: não foi possível criar ou recuperar o prestador seed com email', prestadorEmail);
      process.exit(1);
    }
  }

  // Criar clientes se não existirem
  const existingClientes = clienteRepo.findAllByPrestadorId(prest.id);
  let clientes: any[] = [];
  if (!existingClientes || existingClientes.length === 0) {
    clientes = [
      { id: randomUUID(), prestadorId: prest.id, nome: 'Cliente Seed A', telefone: '81999990001' },
      { id: randomUUID(), prestadorId: prest.id, nome: 'Cliente Seed B', telefone: '81999990002' },
      { id: randomUUID(), prestadorId: prest.id, nome: 'Cliente Seed C', telefone: '81999990003' },
    ];
    clientes.forEach(c => clienteRepo.create(c as any));
    console.log('Clientes seed criados:', clientes.length);
  } else {
    clientes = existingClientes;
    console.log('Clientes já existem, usando existentes:', clientes.length);
  }

  // Criar serviços se não existirem
  const existingServicos = servRepo.findAllByPrestadorId(prest.id);
  let servicos: any[] = [];
  if (!existingServicos || existingServicos.length === 0) {
    servicos = [
      { id: randomUUID(), prestadorId: prest.id, nome: 'Corte', duracaoMinutos: 30, preco: 50.0, posicao: 1 },
      { id: randomUUID(), prestadorId: prest.id, nome: 'Barba', duracaoMinutos: 20, preco: 30.0, posicao: 2 },
      { id: randomUUID(), prestadorId: prest.id, nome: 'Cabelo & Barba', duracaoMinutos: 50, preco: 75.0, posicao: 3 },
    ];
    servicos.forEach(s => servRepo.create(s as any));
    console.log('Serviços seed criados:', servicos.length);
  } else {
    servicos = existingServicos;
    console.log('Serviços já existem, usando existentes:', servicos.length);
  }

  // Datas desejadas: 2025-11-20 e 2025-11-21
  const dates = ['2025-11-20', '2025-11-21'];
  const agendamentos: any[] = [];

  for (const day of dates) {
    // horários: 09:00, 10:00, 11:00, 14:00
    const times = ['09:00', '10:00', '11:00', '14:00'];
    for (let i = 0; i < times.length; i++) {
      const t = times[i];
      const inicioIso = new Date(`${day}T${t}:00.000Z`).toISOString();
      const serv = servicos[i % servicos.length];
      const dur = serv.duracaoMinutos || 30;
      const fim = new Date(new Date(inicioIso).getTime() + dur * 60000).toISOString();
      agendamentos.push({
        id: randomUUID(),
        prestadorId: prest.id,
        clienteId: clientes[i % clientes.length].id,
        servicoId: serv.id,
        dataHoraInicio: inicioIso,
        dataHoraFim: fim,
        status: 'Agendado',
        posicao: i
      });
    }
  }

  // Inserir agendamentos (evita duplicação simples checando por mesmo dia/hora)
  const existing = [] as any[];
  for (const a of agendamentos) {
    // verificar se já existe um agendamento com mesmo prestador e inicio
    const found = (agRepo.findByDay(prest.id, a.dataHoraInicio, a.dataHoraFim) || []).find((x:any) => x.dataHoraInicio === a.dataHoraInicio);
    if (!found) {
      agRepo.create(a);
    } else {
      existing.push(a);
    }
  }

  console.log('Agendamentos inseridos:', agendamentos.length - existing.length, 'existentes pulados:', existing.length);
  console.log('Seed-dates finalizado.');
}

main().catch(err => { console.error('Seed-dates falhou:', err); process.exit(1); });
