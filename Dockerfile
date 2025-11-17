# ---- Builder: instala dependências de build e compila o TypeScript ----
FROM node:20-bullseye AS builder

WORKDIR /app

# Instala ferramentas de build necessárias para node-gyp / better-sqlite3
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-dev build-essential g++ make libsqlite3-dev && \
    rm -rf /var/lib/apt/lists/*

# Copia package.json e package-lock.json para instalar dependências
COPY package*.json ./

# Instala todas as dependências (inclui devDependencies para compilar TS)
RUN npm ci

# Copia o código fonte
COPY . .

# Compila TypeScript
RUN npm run build


# ---- Runner: imagem final somente com dependências de produção ----
FROM node:20-bullseye-slim AS runner

WORKDIR /app

# Define a variável de ambiente para produção
ENV NODE_ENV=production

# Copia apenas os artefatos compilados
COPY --from=builder /app/dist ./dist

# Copia package.json e package-lock.json e instala apenas dependências de produção
COPY package*.json ./
RUN npm ci --only=production

# Garante diretório de dados para o SQLite (montado pelo Fly em /data)
RUN mkdir -p /data

# Expõe porta interna esperada
ENV PORT=4000

# Comando de inicialização
CMD ["node", "dist/backend/server.js"]
