# Escopo e Kanban – Projeto Agenda v3 (Fase: Backend/Domínio) 🏗️

NOTA: adicionar ao escopo.md a seção completa “Armazenamento e Escalabilidade (SQLite vs Postgres)”

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

### Frontend (PWA/Framework - a escolher)
###INFRA e Deploy
-fly.io  

## 🎯 Backlog Priorizado (Fase Backend/Domínio)

A sequência de tarefas garante que a Segurança, Monetização e Domínio Crítico sejam construídos antes de qualquer CRUD ou UI.

1. [SETUP: DB/MODELO] Configurar TS, SQLite e Shared Entities c/ `prestadorId`

   - STATUS: Concluído ✅ (16/11/2025)
   - Observações: Criação das interfaces e esquema inicial do BD; inicialização automática do arquivo de dados `./data/agenda.sqlite` durante startup.
   - Artefatos criados/atualizados:
     - `src/backend/database/index.ts` (inicialização do DB e DDL das tabelas)
     - `src/shared/entities.ts` (tipagens compartilhadas)
     - `package.json` / `package-lock.json` (dependências instaladas)
     - `tsconfig.json` (config TypeScript)
     - `.gitignore`
   - Notas técnicas: `getDbInstance()` exporta a instância do better-sqlite3; índices essenciais criados (`idx_agendamentos_prestador_data`, etc.).
   - `prestadorId` deve ser a chave de ligação em todas as tabelas (Cliente, Serviço, Agendamento, Licença).

2. [CORE: AUTH] Implementar Entidade Prestador, Signup e Login (JWT)

   - Escopo: criação e login de `Prestador` com geração de JWT para sessão (token contém `id`, `prestadorId` e `email`).
   - STATUS: Implementado ✅ (signup + signin + util JWT)

   - Artefatos criados/atualizados:

     - `src/backend/persistence/PrestadorRepository.ts` (findById, findByEmail, create)
     - `src/backend/domain/use-cases/CreatePrestador.ts` (signup — validação zod, bcrypt, uuid)
     - `src/backend/domain/use-cases/SignInPrestador.ts` (signin — validação zod, bcrypt compare)
     - `src/backend/utils/jwt.ts` (geração/validação de JWT — payload mínimo)
     - `src/backend/api/auth.routes.ts` (endpoints `/api/v1/auth/signup` e `/api/v1/auth/login`)
     - `.env.example` (adicionado `JWT_SECRET`)
     - `package.json` (adicionado `jsonwebtoken` e tipos)

   - Como testar localmente:

     1. Instale dependências (nova lib `jsonwebtoken`):

        npm install

     2. Inicie o servidor em modo dev:

        npm run dev

     3. Testar signup (PowerShell):

        Invoke-RestMethod -Uri 'http://localhost:4000/api/v1/auth/signup' -Method Post -Body '{"nome":"Tester","email":"test123@example.com","senha":"secret123"}' -ContentType 'application/json' | ConvertTo-Json -Depth 5

        Resultado esperado: HTTP 201 com JSON { message: 'Conta criada com sucesso!', prestador: { id, prestadorId, nome, email }, token }

     4. Testar login (PowerShell):

        Invoke-RestMethod -Uri 'http://localhost:4000/api/v1/auth/login' -Method Post -Body '{"email":"test123@example.com","senha":"secret123"}' -ContentType 'application/json' | ConvertTo-Json -Depth 5

        Resultado esperado: HTTP 200 com JSON { message: 'Login bem-sucedido!', prestadorId, token }

   - Notas e recomendações de segurança:

     - O `.env.example` foi atualizado com `JWT_SECRET`; em produção use uma string longa e segura.
     - O token emitido tem validade configurada (7 dias no util atual) — considerar refresh tokens para mobile.
     - O payload do token é mínimo (não inclui `senhaHash`).

     ### Implementação local e verificação do JWT

     - Estado atual: durante testes locais criamos o arquivo `.env` com a variável `JWT_SECRET` (não comitar). O servidor emite tokens JWT no signup e no login. Em sessões de teste foi validado que os tokens gerados são decodificáveis e verificáveis com a chave local.

     - Comandos úteis (PowerShell) para desenvolvimento:

       1. Fazer login e armazenar token em `$token`:

          $response = Invoke-RestMethod -Uri 'http://localhost:4000/api/v1/auth/login' -Method Post -Body '{"email":"seu@exemplo.com","senha":"senha"}' -ContentType 'application/json'
          $token = $response.token

       2. Decodificar payload (sem verificar assinatura):

          node -e "console.log(JSON.stringify(require('jsonwebtoken').decode(process.argv[1]), null, 2))" $token

       3. Verificar assinatura com o segredo local (token primeiro, segredo depois):

          $secret = 'VALOR_DE_JWT_SECRET_LOCAL' # pegue do seu .env
          node -e "console.log(require('jsonwebtoken').verify(process.argv[1], process.argv[2]))" $token $secret

       4. Chamar rota protegida enviando o header Authorization:

          Invoke-RestMethod -Uri 'http://localhost:4000/api/v1/protegida' -Headers @{ Authorization = "Bearer $token" } -Method Get

     - Observações práticas:

       - Atenção às aspas no PowerShell ao usar `node -e` (token deve ser o primeiro argumento e o segredo o segundo).
       - Não partilhe `JWT_SECRET` publicamente; mantenha-o somente no `.env` local.

     - Próximo passo recomendado (não implementado automaticamente no código atual):
       - Criar um middleware `auth` (ex.: `src/backend/middlewares/auth.ts`) que use `verifyToken` de `src/backend/utils/jwt.ts` para validar o header `Authorization: Bearer <token>` e injetar `req.prestadorId` nas requisições protegidas. Isso simplifica proteção de rotas e mantém a segregação por `prestadorId`.

3. [CORE: LICENÇA] Implementar Use Case de Verificação de Licença (CRÍTICO)

   - Implementa a função `verificarLicencaAtiva(prestadorId)`.
   - Chamado imediatamente após o login para validar o acesso.

4. [SETUP: FLY.IO] Configurar Deploy e Volume Persistente

   - STATUS: Implementado ✅ (16/11/2025)

   - Resumo: configurado o deploy remoto no Fly.io com volume persistente para o arquivo SQLite. Foram criados os artefatos necessários para a build e deploy (Dockerfile multi-stage, `.dockerignore`, `fly.toml`) e um volume Fly foi provisionado para persistência dos dados.

   - Artefatos criados/atualizados:

     - `Dockerfile` — build multi-stage otimizado para produção (instala dependências em builder, copia apenas `dist` para runner).
     - `.dockerignore` — exclui `node_modules`, `dist`, `data`, `.env` e outros arquivos sensíveis.
     - `fly.toml` — configuração do app Fly com mount apontando o volume `agenda_db_volume` para `/app/data` (caminho onde o app grava `agenda.sqlite`).
     - Comando usado para criar volume (exemplo): `fly volumes create agenda_db_volume --region gru --size 1GB --app agendou-v3-api` (foi criado um volume de 1GB para testes).
     - Segredos: `JWT_SECRET` e `FRONTEND_ORIGIN` foram adicionados via `flyctl secrets set` e estão staged para o primeiro deploy.

   - Como testar / comandos úteis:

     1. Deploy remoto (faz o build no Fly e cria máquinas):

        flyctl deploy -a agendou-v3-api --remote-only

     2. Verificar status das máquinas:

        flyctl machines list -a agendou-v3-api

     3. Verificar logs do app (útil para ver criação das tabelas e mensagens do servidor):

        flyctl logs -a agendou-v3-api

     4. Notas sobre secrets/volume:

        - `JWT_SECRET` foi gerado localmente e enviado como secret do Fly (não comitar a chave).
        - `FRONTEND_ORIGIN` também foi setado: `flyctl secrets set FRONTEND_ORIGIN="http://localhost:3000" --app agendou-v3-api`.
        - O volume montado em `/app/data` garante que o arquivo `agenda.sqlite` persista entre reinícios da máquina Fly.

   - Observações e limitações:

     - SQLite é uma solução adequada para MVP, porém volumes do Fly são atrelados a uma região/host — para escalabilidade horizontal ou alta disponibilidade considere migrar para Postgres gerenciado.
     - O deploy remoto pode falhar na primeira tentativa se não houver máquinas criadas; executar o comando de deploy cria as máquinas automaticamente.
     - Em ambiente de produção, prefira usar uma string forte para `JWT_SECRET` e gerenciar secrets fora do repositório.

   - Próximo passo recomendado após deploy:

     - Rodar `flyctl status -a agendou-v3-api` e `flyctl logs -a agendou-v3-api` para confirmar que o servidor inicializou corretamente e que as tabelas do SQLite foram criadas no volume.

5. [BACKEND: CRUD] Implementar CRUD Completo de CLIENTE

   - CRUD (GET, POST, PUT, DELETE) para a entidade `Cliente`.
   - Validação: telefone numérico.
   - Filtro obrigatório por `prestadorId`.
   - STATUS: Implementado ✅
   - Observações: Implementado endpoints de criação, busca/autocomplete, atualização e exclusão protegidos por `prestadorId`.
   - Artefatos criados/atualizados:

     - `src/backend/persistence/ClienteRepository.ts` (métodos: create, findById, findAllByPrestadorId, update, delete, searchByQuery)
     - `src/backend/domain/use-cases/CreateCliente.ts`, `UpdateCliente.ts`, `DeleteCliente.ts`, `SearchClientes.ts`
     - `src/backend/api/cliente.routes.ts` (rotas POST /api/v1/clientes, PUT /api/v1/clientes/:id, DELETE /api/v1/clientes/:id, GET /api/v1/clientes/search)
     - `src/backend/utils/phone.ts` (normalização de telefones para formato DDI+11)
     - Testes unitários em `src/backend/__tests__` para Create/Update/Delete (Jest + ts-jest) — todos passando localmente (3/3).

   - Notas de implementação:
     - Autenticação por `Prestador` e middleware `auth` foram integrados às rotas para garantir segregação por `prestadorId`.
     - O repositório normaliza telefones antes de persistir e `UpdateCliente` recarrega o registro persistido para refletir normalizações.
     - Adicionado índice `idx_clientes_nome_lower` para otimizar buscas case-insensitive (autocomplete).

6. [BACKEND: CRUD] Implementar CRUD de SERVIÇO

   - CRUD para `Serviço` (Nome, Duração, Preço).
   - Vinculado ao `prestadorId`.
   - STATUS: Parcialmente Implementado (Repositório + Use Cases de Create/List prontos)

   - Artefatos já criados/atualizados:

     - `src/backend/persistence/ServicoRepository.ts` (create, findById, findAllByPrestadorId, update, delete, getNextPosicao)
     - `src/backend/domain/use-cases/CreateServico.ts` (validação com zod, gera id e calcula `posicao` antes de persistir)
     - `src/backend/domain/use-cases/ListServicos.ts` (lista por `prestadorId` ordenado por `posicao`)

   - Pendências / Próximos passos:

     1. Criar as rotas protegidas de serviço (`src/backend/api/servico.routes.ts`) e montar em `server.ts` sob o router protegido (AuthMiddleware).
     2. Implementar Use Cases e rotas de Update e Delete (seguindo padrão de `prestadorId` e verificação de licença onde aplicável).
     3. Adicionar testes unitários e de integração para o fluxo completo do CRUD de serviço (happy-path + erros de validação e proteção por prestador).

   - Observações:

     - A coluna `posicao` já foi adicionada ao DDL do banco e o repositório calcula a próxima posição (`MAX(posicao)+1`) ao criar novos serviços — isso prepara o terreno para o futuro Use Case de reordenação (Drag-and-Drop).
     - Marcaremos a tarefa como concluída quando as rotas protegidas e os testes forem implementados e validados em CI.

7. [BACKEND: DOMÍNIO CRÍTICO] Implementar Use Case de Criação de Agendamento

   - Lógica: horários dentro do atendimento, granularidade de 10 minutos, nenhum overlap permitido.
   - STATUS: Concluído ✅ (Create / Read (List Dia) / Update / Delete / Status implementados)

   - Artefatos criados/atualizados:

     - `src/backend/persistence/AgendamentoRepository.ts` (findConflictingAppointments, create, findBetween, findByDay, findById, update, delete, reindexPosicaoAfterDelete)
     - `src/backend/domain/use-cases/CreateAgendamento.ts` (validação zod, cálculo dataHoraFim, verificação de conflito)
     - `src/backend/domain/use-cases/ListAgendamentosDia.ts` (validação YYYY-MM-DD, intervalo UTC, ordenação e retorno enriquecido com clienteNome/servicoNome)
     - `src/backend/domain/use-cases/UpdateAgendamento.ts` (reagendamento com verificação de conflito)
     - `src/backend/domain/use-cases/UpdateAgendamentoStatus.ts` (alteração rápida de status: Concluido / Cancelado)
     - `src/backend/domain/use-cases/DeleteAgendamento.ts` (remoção segura e reindexação de posições)
     - `src/backend/api/agendamento.routes.ts` (rotas protegidas: POST /, GET /dia/:data, PUT /:id, PUT /:id/status, DELETE /:id)

   - Testes e validação recomendados: criar unit tests para conflito, criação/reagendamento e reindexação; integrar rota GET /dia/:data com supertest.

8. [BACKEND: D&D] Implementar Rotas e Use Case de REORDENAÇÃO (POSITION)

   - STATUS: Concluído ✅

   - Resumo: Implementado o Use Case e a rota de reordenação que permite ao frontend (drag-and-drop) persistir a nova ordem dos agendamentos para um dia.

   - Artefatos criados/atualizados:

     - `src/backend/domain/use-cases/ReorderAgendamentos.ts` (Use Case que valida input e reescreve `posicao` em transação)
     - `src/backend/persistence/AgendamentoRepository.ts` (adicionados métodos `startTransaction`, `commitTransaction`, `rollbackTransaction`, `updatePosicao`)
     - `src/backend/api/agendamento.routes.ts` (rota PUT `/api/v1/agendamentos/reorder` protegida que invoca o Use Case)

   - Ajustes realizados após revisão:

     - Validação adicional no Use Case: agora garantimos que todos os IDs informados existam e pertençam ao mesmo dia (formato YYYY-MM-DD) antes de iniciar a transação. Se houver IDs faltantes ou que não pertençam ao dia requisitado, a operação é abortada com erro descritivo.
     - Reordenação é executada dentro de uma transação do banco; em caso de erro a transação é revertida.
     - Testes unitários adicionados em `src/backend/__tests__/ReorderAgendamentos.test.ts` cobrindo happy-path, IDs faltantes e mismatch de dia.

   - Notas operacionais:

     - A implementação assume que o middleware de autenticação injeta `req.prestadorId` e que o backend valida `prestadorId` em `AgendamentoRepository`.
     - Possível otimização futura: trocar múltiplos SELECT por um `SELECT ... WHERE id IN (...)` para validar todos os agendamentos em uma única consulta (melhora performance para listas grandes).

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
