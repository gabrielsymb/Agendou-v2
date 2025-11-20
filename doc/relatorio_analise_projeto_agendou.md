# Relatório Analítico — Projeto Agendou

Data: 20 de novembro de 2025

Este documento apresenta uma análise completa e explicada em linguagem acessível do projeto "Agendou". O objetivo é dar contexto técnico e funcional para quem não programou o sistema (por exemplo, designers, gestores ou você que recebeu o projeto de uma IA), explicar o fluxo da aplicação, apontar problemas e oferecer orientações práticas para próximos passos.

---

## 1. Visão geral — do que se trata a aplicação

O Agendou é uma aplicação de gerenciamento de agenda para prestadores de serviço (ex.: barbeiros, cabeleireiros, dentistas, personal trainers). Ela permite:

- Cadastrar prestadores (contas de usuários que usam o app para gerenciar seus serviços);
- Criar e listar serviços oferecidos (ex.: Corte de cabelo — 45 minutos, R$ 50);
- Cadastrar clientes (nome, telefone, notas) e consultar seu histórico de atendimentos;
- Marcar agendamentos com data/hora, associando cliente e serviço;
- Reordenar a ordem dos agendamentos em um dia (drag-and-drop no frontend);
- Autenticação (login/registro) com tokens JWT;
- Licenciamento de teste (criação automática de licença de 7 dias para novo prestador).
- ver lucros do dia/mes/quinzena 

Analogias úteis: o Agendou funciona como uma versão simples do Calendly (agendamento) combinada com um mini-CRM (clientes), com uma interface de agenda parecida com a do Google Calendar ou aplicativos de salões que permitem reordenação manual dos atendimentos.

---

## 2. Público-alvo deste relatório

- Desenvolvedores que vão manter ou estender o backend.
- Designers de frontend que precisam entender as telas, fluxos e prioridades de UX.
- Testers e PMs que desejam validar requisitos e priorizar correções.

---

## 3. Arquitetura e responsabilidades (visão geral por pastas)

Observando a estrutura do repositório (resumida):

- `src/backend/` — código do servidor (Express + TypeScript):
  - `api/` — rotas HTTP (endpoints REST).
  - `domain/use-cases/` — regras de negócio (a camada que aplica validações e regras antes de gravar no DB).
  - `persistence/` — repositórios que conversam com o banco (SQLite via better-sqlite3).
  - `database/` — inicialização do banco, criação de tabelas (migrations simples).
  - `middlewares/` — autenticação JWT.
  - `utils/` — utilitários (normalizar telefone, gerar/verificar JWT, etc.).
- `src/frontend/` — aplicação cliente (Svelte + Vite) com componentes, rotas e integração com a API.
- `src/shared/entities.ts` — tipos/contratos compartilhados entre frontend e backend (entidades: Cliente, Prestador, Servico, Agendamento).
- `data/agenda.sqlite` — arquivo do banco (SQLite) com dados.

Nota sobre gerenciadores de pacotes: este repositório contém dois arquivos `package.json` separados e independentes — um na raiz (voltado para o backend) e outro em `src/frontend/` (apenas para o frontend Svelte). Eles são gerenciados separadamente.

Observação: algumas importações e definições podem ter sido geradas por IA e apresentam repetições/caminhos inconsistentes; ver seção técnica.

---

## 4. Fluxo da aplicação — passo a passo (visão para leigos)

Abaixo está o fluxo típico, do ponto de vista do usuário e da aplicação, com correspondência aos componentes do código.

1. Inicialização do servidor (backend)
   - Arquivo principal: `src/backend/server.ts`.
   - O servidor inicializa o banco de dados (`src/backend/database/index.ts`) — cria as tabelas se necessário.
   - Após preparar o DB, o servidor registra as rotas da API (p.ex. `/api/v1/auth`, `/api/v1/clientes`).

2. Registro/Login (fluxo do prestador)
   - Usuário abre aplicativo web (frontend Svelte) e acessa tela de registro.
   - Frontend envia requisição POST `/api/v1/auth/register` ou `/signup` com nome, email, senha.
   - Backend (use-case `RegisterPrestador`) valida os dados, cria o prestador e uma licença de teste de 7 dias, armazena no banco e retorna um token JWT.
   - Com o token JWT, o frontend guarda o token (ex: cookie seguro ou localStorage) e passa a usá-lo em Authorization: Bearer <token> nas chamadas subsequentes.

3. Gerenciamento de serviços e clientes
   - Frontend solicita lista de serviços (`/api/v1/servicos`) e lista de clientes (`/api/v1/clientes`).
   - Quando cadastrar um cliente, frontend envia POST `/api/v1/clientes` com nome e telefone. Backend normaliza telefone (função `normalizePhoneBR`) e grava no banco.
   - Para buscar clientes (autocomplete), frontend chama `/api/v1/clientes/search?q=Maria` e o backend usa índice (index) para retornar resultados rápidos.

4. Criar e listar agendamentos
   - Usuário cria um agendamento escolhendo cliente, serviço, data/hora.
   - Backend executa validações contra conflitos (`AgendamentoRepository.findConflictingAppointments`) e persiste o agendamento.
   - Para exibir a agenda do dia, frontend chama `/api/v1/agendamentos?data=YYYY-MM-DD` e recebe os agendamentos ordenados por status e por `posicao`.

5. Reordenar agendamentos (drag-and-drop)
   - Frontend envia um PUT `/api/v1/agendamentos/reorder` com a nova ordem (lista de IDs) e a data do dia.
   - Backend valida que todos os IDs existem e pertencem ao mesmo dia, começa uma transação, atualiza `posicao` para cada agendamento e comita.

6. Histórico do cliente
   - Na página do cliente, frontend solicita `/api/v1/clientes/:id/history` para ver atendimentos passados (serviço, preço, data).

Exemplo comparativo de fluxo: imagine um aplicativo de salão de beleza onde o recepcionista cria o cliente, escolhe um serviço e agenda no horário disponível — o Agendou segue esse mesmo padrão básico.

---

## 5. Mapa de rotas principais (resumido)

- POST `/api/v1/auth/register` — criar conta + licença
- POST `/api/v1/auth/login` — autenticar e receber token
- POST `/api/v1/clientes` — criar cliente
- PUT `/api/v1/clientes/:id` — atualizar cliente
- GET `/api/v1/clientes/search?q=` — busca de clientes
- GET `/api/v1/clientes/:id/history` — histórico do cliente
- GET `/api/v1/agendamentos?data=` — listar agendamentos do dia
- POST `/api/v1/agendamentos` — criar agendamento
- PUT `/api/v1/agendamentos/reorder` — reordenar lista do dia
- GET/POST/PUT para `servicos` — gerenciar serviços (CRUD)

> Nota: Algumas rotas no código foram deixadas em placeholder (retornam `{ ok: true }`) — essas precisam de implementação completa.

---

## 6. Funcionalidades-chave explicadas para designers (seção dedicada)

Esta seção foi escrita para que designers de frontend compreendam objetivos de UX, dados necessários e telas prioritárias.

Objetivo de UX central:
- Permitir que um prestador gerencie rapidamente o dia: ver agenda do dia, reagendar (arrastar/agendar), criar novo cliente, registrar atendimento e revisar histórico.

Telas/Componentes primários sugeridos:

1. Tela de Login / Registro
   - Simples, com e-mail e senha.
   - Mensagens de erro claras (e-mail existente, senha fraca).

2. Dashboard / Visão Geral
   - Indicadores: número de agendamentos hoje, licensa (dias restantes), receita estimada do dia.
   - alerta de licença expira em dia x 

3. Agenda diária (tela principal)
   - Lista vertical por horário (coluna): cada agendamento mostra horário, cliente, serviço, status.
   - Modo drag-and-drop para reordenar; ação de salvar dispara `PUT /reorder`.
   - A ordenação deve refletir `posicao` no backend.

4. Ficha do Cliente
   - Mostrar dados (nome, telefone), histórico de atendimentos (data, serviço, preço).
   - Botão rápido para "Criar agendamento" com pré-seleção do cliente.

5. Tela de Serviços
   - Listagem ordenável (posicao), CRUD de serviços.

6. Formulário de criação de agendamento
   - Seleção de cliente (autocomplete), seleção de serviço (lista), escolha de horário (validação de conflito pelo backend), observações.

Prefira interações que minimizem cliques para o usuário profissional: atalhos de teclado, botões rápidos ("Atender próximo"), e feedbacks visuais para conflito de horário.

Material para o design system (dados das entidades)
- Prestador: id, nome, email
- Cliente: id, nome, telefone, notas
- Servico: id, nome, duracaoMinutos, preco, posicao
- Agendamento: id, clienteId, servicoId, dataHoraInicio, dataHoraFim, status, posicao

Observações para designers:
- Telefones são armazenados normalizados com DDI (`55` prefixado). Ao mostrar ao usuário, formatar para `(+55) XX 9YYYY-ZZZZ`.
- Datas são guardadas como ISO strings; no frontend, usar Day.js ou Intl para exibir horário local.
- Indicar claramente status do agendamento (Agendado, Concluido, Cancelado, Reagendado) com cores consistentes.

---

## 7. Principais problemas detectados (resumo técnico curto)

1. Tipagem duplicada: `IPrestador` aparece duplicado em `src/shared/entities.ts` — pode causar confusão.
2. Imports inconsistentes (alguns arquivos usam caminhos relativos incorretos como `../../../backend/persistence/...`) — padronizar caminhos.
3. `tsconfig.json` inclui frontend e backend juntos — recomenda-se separar configurações.
4. `JWT_SECRET` tem fallback inseguro; em produção, falhar se não estiver configurado.
5. Dependência `sqlite3` e `better-sqlite3` coexistem — remover a não usada.
6. Algumas rotas estão apenas com placeholders — implementar lógica completa.

---

## 8. Recomendações de prioridades para a equipe técnica

Curto prazo (corrigir o que impede o uso seguro):
- Tornar `JWT_SECRET` obrigatório em produção.
- Corrigir duplicação de tipos em `shared/entities.ts`.
- Ajustar imports relativos que estão incorretos.
- Remover dependências não usadas e simplificar `package.json`.

Médio prazo (melhorias de qualidade):
- Separar `tsconfig` de backend e frontend.
- Adicionar linter (ESLint) e formatação (Prettier).
- Implementar testes unitários para casos críticos (CreateCliente, SignIn, Reorder).

Longo prazo (UX/arquitetura):
- Considerar migração para RDBMS com melhor concorrência se houver muitos usuários concorrentes (SQLite tem limitações de escrita).
- Implementar versão mobile-friendly do frontend (PWA). Já há arquivos públicos e manifest, então é compatível.

---

## 9. Exemplo de fluxo detalhado (texto passo-a-passo) — uma jornada

Cenário: Maria, dona de um salão, cria uma conta e agenda clientes.

1. Maria acessa a aplicação e clica em "Registrar". O frontend envia `/api/v1/auth/register`.
2. Backend cria a conta `prestador` e uma licença de teste de 7 dias; retorna token.
3. Maria faz login; frontend obtém lista de serviços e clientes e abre a agenda do dia.
4. Um cliente chega: Maria cria um novo cliente (nome + telefone) via formulário — isso chama POST `/api/v1/clientes`.
5. Maria cria um agendamento para 14:00 escolhendo o serviço "Corte" — backend valida conflitos e grava.
6. Durante o dia, Maria reorganiza a ordem dos atendimentos arrastando itens. O frontend envia PUT `/api/v1/agendamentos/reorder` com a nova ordem; backend atualiza `posicao` em transação.

---

## 10. Apêndice técnico (resumo prático para desenvolvedores)

- Arquivo de inicialização: `src/backend/server.ts` — inicia DB e registra rotas.
- DB: `src/backend/database/index.ts` — cria tabelas `prestadores`, `licenca`, `clientes`, `servicos`, `agendamentos` e índices.
- Repositórios: `src/backend/persistence/*.ts` — métodos para CRUD e queries otimizadas.
- Use-cases principais: `src/backend/domain/use-cases/*` — encapsulam regras de negócio e chamam os repositórios.
- Middlewares: `src/backend/middlewares/auth.ts` — valida JWT e adiciona `prestadorId` à req.
- Utilitários: `src/backend/utils/phone.ts` (normaliza telefones), `src/backend/utils/jwt.ts` (geração/verificação de tokens).

---

## 11. Próximos passos imediatos sugeridos (agenda de trabalho)

1. Conversar com designers para validar a experiência da agenda diária (prioridade: tela de reordenação e ficha de cliente).
2. Corrigir duplicação de tipos e imports errados (tarefa de desenvolvedor, 1 dia).
3. Implementar os endpoints que estão em placeholder para fechar o contrato com o frontend.
4. Escrever 10 testes unitários para os use-cases críticos.

---

## 12. Observações finais e convite à equipe de design

Designers: esse app é focado em velocidade de operação para profissionais que precisam gerenciar horários rapidamente. Priorizem clareza e rapidez. Algumas recomendações visuais:

- Layout central em mobile-first; botão grande de "Novo Agendamento"; gesto de arrastar para reagendar;
- Feedback imediato ao arrastar (sombra, placeholder) e confirmação visual quando salvar a ordem;
- Tela de cliente com histórico em cartão, filtro por período e botão rápido para ligar/enviar WhatsApp (formatar número com DDI);
 - A paleta de cores será redefinida (será definida pela equipe de design em etapa seguinte).
 direção estetica neutralidade quente 
energia leve, rapida, proximidade humana
---

## 13. Local do arquivo

Este relatório foi salvo em: `doc/relatorio_analise_projeto_agendou.md`

---

Se quiser, eu atualizo automaticamente o código para 1-3 correções de prioridade alta (ex: unificar `IPrestador`, tornar `JWT_SECRET` obrigatório e corrigir imports relativos). Qual dessas você quer que eu faça agora?
