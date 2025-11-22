# Agendou - notas de desenvolvimento

Pequenas instruções úteis para desenvolver localmente e sincronizar variáveis de ambiente.

## Variáveis importantes (.env)

- DB_PATH: caminho para o arquivo SQLite utilizado pelo servidor e pelos scripts.
- JWT_SECRET: segredo usado para assinar/verificar tokens JWT. Deve ser o mesmo para o servidor e para scripts que geram tokens.
- DB_VERBOSE: `1` habilita logs SQL verbosos (somente em dev).
- DEBUG: `1` habilita logs de debug no backend (evitar em produção).
- VITE_DEBUG: `1` habilita logs no frontend (dev).

### Exemplo de `.env` (não commitável)

DB_PATH=C:\\Agendou\\data\\agenda.sqlite
JWT_SECRET=uma-string-forte-gerada-aleatoriamente
DB_VERBOSE=0
DEBUG=0
PORT=4000

> Não adicione valores verdadeiros de segredos ao controle de versão. Use `.env` local ou um gerenciador de segredos.

## Como sincronizar no PowerShell

Se você abrir várias shells (uma para rodar o servidor e outra para rodar scripts), defina as mesmas variáveis em cada shell.

Exemplos PowerShell (definem apenas para a sessão atual):

$env:DB_PATH = 'C:\\Agendou\\data\\agenda.sqlite';
$env:JWT_SECRET = 'uma-string-forte-gerada-aleatoriamente';
$env:DB_VERBOSE = '0';
$env:DEBUG = '0';

Depois, inicie o servidor na mesma sessão:

node --enable-source-maps -r ts-node/register src/backend/server.ts

Ou utilize o script npm adequado do `package.json` na raiz se existir.

## Dicas rápidas

- Sempre verifique que `DB_PATH` aponta para o mesmo arquivo quando seeds ou scripts parecerem não refletir no servidor.
- Gere `JWT_SECRET` com uma ferramenta segura (ex.: `openssl rand -hex 32`) e mantenha-o privado.
- Ative `DEBUG=1` somente localmente quando precisar de logs de depuração.
