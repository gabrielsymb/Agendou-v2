Ótimo! Vamos iniciar o código para a Tarefa 1 (WIP=1).

Vamos criar o package.json com as dependências essenciais que você listou e o tsconfig.json para configurar o ambiente TypeScript.

🛠️ 1. package.json (Raiz do Projeto)
Este arquivo define os scripts para rodar o servidor e as dependências que vamos usar. Estamos focando em better-sqlite3, express, cors, dotenv e as ferramentas de desenvolvimento.

JSON

{
"name": "projeto-agenda-v3-backend",
"version": "1.0.0",
"description": "Backend para PWA Agenda v3, Node.js + TypeScript + SQLite",
"main": "./src/backend/server.ts",
"scripts": {
"start": "node ./dist/backend/server.js",
"dev": "ts-node-dev --respawn --transpile-only ./src/backend/server.ts",
"build": "tsc"
},
"keywords": [ # Setup inicial — Tarefa 1 (WIP=1)

    Vamos criar os arquivos iniciais para o backend TypeScript+SQLite: `package.json`, `tsconfig.json`, `.env.example`, além de exemplos de `entities.ts` e `server.ts`.

    ---

    ## 1) package.json (raiz do projeto)

    Este arquivo define scripts e dependências essenciais (better-sqlite3, express, cors, dotenv, zod, etc.).

    ```json
    {
      "name": "projeto-agenda-v3-backend",
      "version": "1.0.0",
      "description": "Backend para PWA Agenda v3, Node.js + TypeScript + SQLite",
      "main": "./src/backend/server.ts",
      "scripts": {
        "start": "node ./dist/backend/server.js",
        "dev": "ts-node-dev --respawn --transpile-only ./src/backend/server.ts",
        "build": "tsc"
      },
      "keywords": ["typescript","express","sqlite"],
      "author": "",
      "license": "ISC",
      "dependencies": {
        "better-sqlite3": "^11.1.2",
        "cors": "^2.8.5",
        "dotenv": "^16.4.5",
        "express": "^4.19.2",
        "express-async-errors": "^3.1.1",
        "zod": "^3.23.8"
      },
      "devDependencies": {
        "@types/better-sqlite3": "^7.6.10",
        "@types/cors": "^2.8.17",
        "@types/express": "^4.17.21",
        "@types/node": "^20.14.9",
        "ts-node-dev": "^2.0.0",
        "typescript": "^5.5.3"
      }
    }
    ```

    ---

    ## 2) tsconfig.json

    Configuração TypeScript para compilar `src` → `dist` com opções adequadas para Node.js.

    ```json
    {
      "compilerOptions": {
        "target": "ES2020",
        "module": "CommonJS",
        "rootDir": "./src",
        "outDir": "./dist",
        "esModuleInterop": true,
        "forceConsistentCasingInFileNames": true,
        "strict": true,
        "skipLibCheck": true,
        "moduleResolution": "node",
        "resolveJsonModule": true,
        "sourceMap": true,
        "experimentalDecorators": true
      },
      "include": ["src/**/*"],
      "exclude": ["node_modules"]
    }
    ```

    ---

    ## 3) .env.example

    Variáveis de ambiente mínimas.

    ```env
    # Caminho para o arquivo SQLite. Em produção (Fly.io) isso será mapeado para um Fly Volume.
    DB_PATH=./data/agenda.sqlite

    # Origem do frontend (para CORS em dev)
    FRONTEND_ORIGIN=http://localhost:3000

    # Porta do servidor
    PORT=4000
    ```

    ---

    ## 4) `src/shared/entities.ts` — interfaces TypeScript (exemplo)

    Exemplo de tipagens compartilhadas entre backend e frontend. `prestadorId` está em todas as entidades.

    ```ts
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
      tipoLicenca: 'diaria' | 'semanal' | 'mensal';
      chaveAleatoria: string;
      dataInicio: string; // ISO string
      dataFim: string;    // ISO string
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
    }

    export interface IAgendamento extends IBaseEntity {
      clienteId: string;
      servicoId: string;
      dataHoraInicio: string; // ISO string UTC
      dataHoraFim: string;    // ISO string UTC (calculado)
      status: 'Agendado' | 'Concluido' | 'Cancelado' | 'Reagendado';
      posicao?: number;
    }
    ```

    ---

    ## 5) `src/backend/server.ts` — esqueleto do servidor

    Exemplo mínimo de inicialização do Express com CORS, parsing JSON e tratamento de erros.

    ```ts
    import 'dotenv/config';
    import 'express-async-errors';

    import express from 'express';
    import cors from 'cors';

    const PORT = process.env.PORT || 4000;
    const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

    const app = express();

    app.use(cors({ origin: FRONTEND_ORIGIN, methods: ['GET','POST','PUT','DELETE'], credentials: true }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.get('/', (req, res) => res.status(200).json({ message: 'Agendou v3 Backend API is running!' }));

    // Rotas de exemplo (implementação futura)
    // app.use('/api/v1/appointments', appointmentRoutes);

    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error(err.stack);
      return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    });

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
    ```

    ---

    Se quiser, eu posso gerar automaticamente esses arquivos reais no repositório (`package.json`, `tsconfig.json`, `.env.example`, `src/shared/entities.ts`, `src/backend/server.ts`) e rodar um teste rápido para confirmar que o servidor inicia no modo `dev` (somente criando os arquivos e sem instalar dependências). Diga se devo prosseguir.
