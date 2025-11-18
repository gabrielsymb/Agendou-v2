// Shared entities and interfaces between backend and frontend
// Tipagens compartilhadas para o projeto Agenda v3

export interface IRegisterData {
  nome: string;
  email: string;
  password: string;
}

export interface IPrestador {
  id: string;
  prestadorId: string;
  nome: string;
  email: string;
}
// Shared entities and interfaces between backend and frontend
// Tipagens compartilhadas para o projeto Agenda v3

// Define o tipo base que todas as entidades usam
export interface IBaseEntity {
  id: string; // UUID ou ID único
  prestadorId: string; // Chave de segregação de dados
}

export interface IPrestador extends IBaseEntity {
  nome: string;
  email: string;
  senhaHash: string; // Senha criptografada
}

export interface ILicenca extends IBaseEntity {
  tipoLicenca: "diaria" | "semanal" | "mensal";
  chaveAleatoria: string;
  dataInicio: string; // ISO string
  dataFim: string; // ISO string
  ativa: boolean;
}

export interface ICliente extends IBaseEntity {
  nome: string;
  telefone: string; // só dígitos
  email?: string;
  notas?: string;
}

export interface IServico extends IBaseEntity {
  nome: string;
  duracaoMinutos: number;
  preco: number;
  posicao: number; // posição para ordenação (Drag-and-Drop)
}

export interface IAgendamento extends IBaseEntity {
  clienteId: string;
  servicoId: string;
  dataHoraInicio: string; // ISO string UTC
  dataHoraFim: string; // ISO string UTC (calculado)
  status: "Agendado" | "Concluido" | "Cancelado" | "Reagendado";
  posicao?: number;
}
