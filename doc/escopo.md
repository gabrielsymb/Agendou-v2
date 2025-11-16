# Escopo e Kanban – Projeto Agenda v3 (Fase: Backend/Domínio) 🏗️

**Arquitetura de Aplicação**

- Modelo de Desenvolvimento: **Kanban** (WIP = 1)
- Stack: **Full-Stack TypeScript** (Node.js/TS no Backend + React no Frontend)
- Banco de Dados: **SQLite** (hospedado no Fly Volume do Fly.io para persistência)
- Regra Anti-Caos: **Arquitetura de Camadas** (Domínio, Persistência, API) — evitar arquivos com mais de 1000 linhas

## Dependências e Bibliotecas (sugestões)

Lista recomendada organizada por camada e finalidade, alinhada ao stack TypeScript / Node.js / React / SQLite / Fly.io.

### Backend (Node.js + TypeScript)

- typescript, ts-node-dev (dev)
- express (servidor HTTP)
- cors (CORS middleware)
- dotenv (variáveis de ambiente)
- express-async-errors (tratamento de erros async)
- zod ou joi (validação de payloads)
- sqlite3 ou better-sqlite3 (driver SQLite)
- knex ou typeorm (opcional, query builder/ORM) — para MVP um repositório simples com better-sqlite3 é suficiente
- bcrypt ou argon2 (hash de senha)
- jsonwebtoken (JWT) ou @auth/jwt (auth)
- pino ou winston (logging)
- node-cron ou bullmq (jobs/cron para lembretes)

### Shared (tipos/entidades entre Front e Backend)

- typescript types (tipagens compartilhadas em `src/shared/entities.ts`)
- zod schemas (opcional, para validação compartilhada)

### Frontend (React / PWA)

- react, react-dom
- vite ou create-react-app (ferramenta de build) — Vite recomendado
- react-router (navegação)
- axios ou fetch (requisições HTTP)
- zustand ou redux (state management leve) — sugestão: zustand para MVP
- date-fns ou luxon (manipulação de datas/timezones)
- Workbox ou PWA plugins do Vite (para PWA/offline)
- localforage ou idb/async-storage (cache local no cliente)
- typescript, vite-plugin-svgr (assets)

### Infra e Deploy

- flyctl (CLI do Fly.io)
- fly.toml (config)
- supervisor de volumes (configuração Fly Volume) para persistência do SQLite

### Testes e Qualidade

- vitest / jest (unit tests)
- supertest (integração HTTP)
- eslint, prettier (lint/format)
- husky, lint-staged (pre-commit hooks)
- simple-git-hooks (opcional)

### Observações

- Preferir bibliotecas minimalistas e bem mantidas. Para o MVP, evitar introduzir muitos frameworks complexos; priorizar produtividade e estabilidade.

## Estrutura de Pastas Atual (workspace c:\Agendou)

```
c:\Agendou
|-- README.md
|-- doc
|   |-- escopo.md
|
|-- src
|   |-- shared
|   |   |-- entities.ts
|   |-- backend
|   |   |-- server.ts
|   |   |-- api
|   |   |   |-- appointment.routes.ts
|   |   |   |-- .gitkeep
|   |   |-- domain
|   |   |   |-- use-cases
|   |   |   |   |-- README.md
|   |   |   |   |-- .gitkeep
|   |   |-- persistence
|   |   |   |-- AppointmentRepository.ts
|   |   |   |-- .gitkeep
```

Observação: esta árvore reflete os arquivos e pastas presentes no workspace no momento. Alguns arquivos são placeholders criados para estruturar o projeto.

## 🎯 Backlog Priorizado (Fase Backend/Domínio)

A sequência de tarefas garante que a Segurança, Monetização e Domínio Crítico sejam construídos antes de qualquer CRUD ou UI.

1. [SETUP: DB/MODELO] Configurar TS, SQLite e Shared Entities c/ `prestadorId`

   - WIP = 1
   - Criação das interfaces e esquema inicial do BD.
   - `prestadorId` deve ser a chave de ligação em todas as tabelas (Cliente, Serviço, Agendamento, Licença).

2. [CORE: AUTH] Implementar Entidade Prestador e Login Básico

   - Criação da tabela `Prestadores`, Repositório e Use Case de Login/Sessão (identifica o usuário).

3. [CORE: LICENÇA] Implementar Use Case de Verificação de Licença (CRÍTICO)

   - Implementa a função `verificarLicencaAtiva(prestadorId)`.
   - Chamado imediatamente após o login para validar o acesso.

4. [SETUP: FLY.IO] Configurar Deploy e Volume Persistente

   - Configurar `fly.toml` e Fly Volume para garantir a persistência do banco SQLite no servidor.

5. [BACKEND: CRUD] Implementar CRUD Completo de CLIENTE

   - CRUD (GET, POST, PUT, DELETE) para a entidade `Cliente`.
   - Validação: telefone numérico.
   - Filtro obrigatório por `prestadorId`.

6. [BACKEND: CRUD] Implementar CRUD de SERVIÇO

   - CRUD para `Serviço` (Nome, Duração, Preço).
   - Vinculado ao `prestadorId`.

7. [BACKEND: DOMÍNIO CRÍTICO] Implementar Use Case de Criação de Agendamento

   - Lógica: horários dentro do atendimento, granularidade de 10 minutos, nenhum overlap permitido.
   - Status inicial: `Agendado`.

8. [BACKEND: D&D] Implementar Rotas e Use Case de REORDENAÇÃO (POSITION)

   - Endpoint que recebe 2 IDs e troca seus horários (swap), aplicando revalidação de conflito do domínio.

9. [BACKEND: CANCELAMENTO] Implementar Use Case de Cancelamento/Conclusão
   - Alterar status para `Cancelado` ou `Concluído` e registrar no histórico do cliente.

## 💡 Observações Críticas e Regras de Domínio

### A. Segregação de Dados e Monetização

- `prestadorId` é a chave de tudo: todas as consultas e escritas no BD devem filtrar por `prestadorId` (garante que um Prestador não veja dados de outro).
- Fluxo de Acesso: **Login → Verificação de Licença → Liberação do acesso**.
- Licença: a lógica `verificarLicencaAtiva` deve ser injetada em todos os Use Cases de escrita (POST, PUT, DELETE) para bloquear o acesso quando necessário.

### B. Regras de Agendamento

- Horários: armazenar como DateTime para precisão, com granularidade de 10 minutos.
- Não permitir overlap entre agendamentos.
- Cálculo: o Use Case de Agendamento deve calcular a Data/Hora de Término com base na duração do serviço.

### C. Comunicação Backend (Códigos de Erro HTTP)

| Erro                               |     Código HTTP | Mensagem de Exemplo (JSON)                          |
| ---------------------------------- | --------------: | --------------------------------------------------- |
| Licença Expirada/Inválida          |   403 Forbidden | {"error": "Licença expirada ou não encontrada"}     |
| Conflito de Horário (Overlap)      |    409 Conflict | {"error": "Horário indisponível devido a conflito"} |
| Dados Inválidos (Regra do Negócio) | 400 Bad Request | {"error": "Telefone deve ser numérico"}             |
| Recurso Não Encontrado             |   404 Not Found | {"error": "Cliente ou Serviço não encontrado"}      |

## Contrato rápido para Use Cases (inputs/outputs/erros)

- Input padrão: { prestadorId: string, body: {...} }
- Output: HTTP 2xx com JSON do recurso ou erro padronizado (ver seção de códigos de erro).
- Erros de validação: 400, licença: 403, conflito: 409, não encontrado: 404.

## Casos de Borda Relevantes

- Requisições com `prestadorId` faltando ou inválido.
- Agendamentos grandes que cruzam o horário de atendimento.
- Operações concorrentes que tentam criar agendamentos no mesmo intervalo.

## Próximos Passos (curto prazo)

1. Finalizar o setup inicial (TS + SQLite + entities).
2. Implementar Auth básico e injetar `verificarLicencaAtiva`.
3. Criar testes unitários para as regras críticas do domínio (overlap, cálculo de término, validação de telefone).

---

## Infra: CORS e nota sobre Proxy (MVP)

Resumo: para o MVP com 1 backend Node.js e 1 frontend React (PWA), **não é obrigatório usar um proxy service**. Um proxy pode ser útil em arquiteturas com múltiplos backends ou API Gateways, mas neste projeto ele seria overhead desnecessário agora.

Quando um proxy faz sentido (futuro):

- Unificar URLs de múltiplos serviços (API Gateway).
- Lidar com CORS sem tocar o backend (apenas em dev/arquiteturas específicas).
- Inserir caching, compressão ou manipular headers/tokens globalmente.

No seu caso atual:

- Você tem 1 backend Node.js e 1 frontend React. Não há múltiplos serviços nem microserviços por enquanto.
- SQLite é local ao backend e não adiciona necessidade de proxy.

Conclusão prática: **não usar proxy agora**. Em vez disso, aplicar medidas simples e robustas:

1. Configurar CORS no backend (essencial agora)

```js
// exemplo mínimo no Node/Express
import cors from "cors";
app.use(
  cors({ origin: process.env.FRONTEND_ORIGIN || "http://localhost:3000" })
);
```

2. Usar variáveis de ambiente no frontend para apontar a API (ex.: `REACT_APP_API_URL` ou `VITE_API_URL`).

3. Garantir que toda lógica crítica (D&D, verificação de agendamentos, regras de negócio) permaneça no backend — o frontend apenas consome os endpoints.

### ✅ Resumo para o WIP=1

| Configuração    | Onde Acontece               | Observação                                                                                |
| --------------- | --------------------------- | ----------------------------------------------------------------------------------------- |
| CORS Middleware | Código do Node.js (Backend) | Essencial agora; configurar origens de dev/prod e usar `cors`                             |
| Proxy Service   | Config do React (Frontend)  | NÃO obrigatório para o MVP; adicionar só se houver múltiplas APIs/microservices no futuro |

---

## D. Mobile-First (Impacto no Backend)

O backend deve ser otimizado para aplicações móveis e PWAs, garantindo **performance, segurança e consistência**. Esta seção define como o front-end deve interagir com o backend sem assumir regras críticas do domínio.

### 1. Payloads Enxutos (DTOs)

- Todas as APIs devem retornar apenas os campos necessários (DTOs por tela).
- Exemplo: listagem de agendamentos

```ts
[
  {
    id: 1,
    clienteId: 10,
    servicoId: 5,
    inicio: "2025-11-16T10:00:00Z",
    fim: "2025-11-16T10:30:00Z",
    status: "Agendado",
  },
];
```

### 2. Conectividade Intermitente e Sync

- Planejar suporte a leitura offline (cache local) e sincronização incremental (endpoint `/sync` ou `/changes?since=`).
- Definir estratégia de resolução de conflitos (server-wins recomendado para começar).

### 3. Autenticação Móvel

- Token-based auth com refresh tokens. Armazenamento seguro no cliente (Keychain/Keystore).
- Verificação de licença: TTL curto (ex.: 5 min) para cache; escritas críticas devem exigir verificação online.

### 4. Device Tokens e Notificações

- Endpoint para registrar device tokens (FCM/APNs) e job para envio de lembretes/notificações.

### 5. Timestamps e Timezones

- Usar UTC nos timestamps do backend. Cliente envia timezone quando necessário. Garantir cálculo de término consistente no backend.

### 6. Idempotência e Retries

- Endpoints de criação críticos (ex.: agendamentos) devem aceitar idempotency keys para evitar duplicação durante retries.

### 7. Performance e Indexação

- Indexar colunas críticas (`prestadorId`, `startAt`, `endAt`) e garantir queries rápidas para listas de agenda.

### 8. Política Offline (decisão)

- Recomenda-se: leitura offline permitida; escritas exigem conexão online para garantir integridade do domínio. Se optar por criação offline, precisarão regras de merge e resolução de conflitos.

### 9. Testes e Monitoramento

- Adicionar testes que simulem reconexão/offline e conflitos. Monitorar latência e taxa de erros em endpoints móveis.

---

Se quiser, aplico estas mudanças diretamente no backlog (adicionando tarefas específicas para Sync API, Device Tokens, Idempotency, etc.) ou crio um `doc/escopo-frontend.md` com o detalhamento mobile-first (UX e implementação).
