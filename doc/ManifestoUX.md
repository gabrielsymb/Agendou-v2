Manifesto UX / UI — Agendou! (Versão Svelte SPA PWA)

Diretrizes técnicas e estéticas para interface, comportamento e arquitetura de componentes. O objetivo é garantir um app coerente, fluido, mobile-first e com aparência nativa (similar a Spotify / Youtube / Telegram).

1. Fundamentos de Produto

Identidade visual

Tema Dark por padrão, inspirado em Spotify.

Paleta base:

Fundo principal: #121212

Containers: #1E1E1E

Elevation leve: #232323

Texto forte: #FFFFFF

Texto médio: #B3B3B3

Texto fraco: #737373

Ação primária (accent): escolhido pelo produto (verde Spotify ou outra cor exclusiva)

Tipografia limpa, tamanhos maiores para leitura confortável.

Aparência de App Instalado

Proibir zoom por double-tap.

Proibir copy/paste globalmente.

Permitir copy/paste somente em campos de entrada e pesquisa.

Nenhum highlight azul padrão de navegador.

Nenhuma borda nativa feia em inputs (estilização custom).

Arquitetura do Frontend

Svelte + Vite + SPA (rotas simples).

CSS isolado em CSS Modules (sem Tailwind, sem Bootstrap).

Componentes de comportamento com Radix UI.

Ícones com Iconify.

Estrutura clara de responsabilidades:


  /components   → Botões, Cards, Inputs, Modais, DnDItem
  /features     → Funcionalidades isoladas (ex.: dnd, toast, modal)
  /routes       → Telas completas (Welcome, Login, Home, etc)
  /services     → Requisições ao backend (CRUD agenda/cliente/serviço)
  /stores       → Estados globais (usuário, agenda)
  /utils        → Helpers

2. Páginas do Aplicativo
2.1 Welcome (Primeiro Acesso)

Ícone simples (SVG minimalista) centralizado.

Dois botões: Login / Criar Conta.

Sem navegação adicional.

Responsividade focada em telas pequenas.

Não rolar conteúdo vertical se possível.

Nada mais: é a porta de entrada.

2.2 Login / Registro

Inputs full-width, tipografia grande.

Botão de ação primária com accent do produto.

Feedback claro de erro/sucesso (toast).

Ações não devem depender de navegação do navegador (evitar “voltar”).

Indicadores de loading para qualquer requisição.

2.3 Home / Agenda (tela principal)

É a tela mais importante do app.

A. Estrutura visual

Lista vertical de cards comprimidos, cada card = um agendamento.

Dois níveis de informação:

Primário: cliente + horário

Secundário: duração, serviço

Arrastar card → mostra ações:

B. Gestos

Swipe para direita → Concluir

Swipe para esquerda → Cancelar

Implementar threshold de 20–30px (evita disparos acidentais).

Feedback visual claro (borda verde/vermelha e ícone).

C. Drag and Drop (DnD vertical)

Reordenar posição do agendamento.

A posição final deve refletir position do backend.

Se Pedro sobe para posição de João → horários trocam (backend já cuida).

D. Ações no Card

Botão único de editar (ícone de lápis).

Abre modal com campos do cliente/serviço/horário/dia.

Modal central, escuro, elevado (#232323).

E. FAB (Floating Action Button)

Botão flutuante de “Novo Agendamento” no canto inferior direito.

Circular, accent color, ícone de “+”.

F. Bottom Navigation

Quatro abas: Agenda, Clientes, Serviços, Config.

Estilo Telegram/Youtube (ícones centrados, sem labels exagerados).

Deve parecer nativa, não website.

2.4 Clientes

Lista de cards.

Card com nome, telefone, ações de editar/excluir.

Toque abre detalhes.

2.5 Serviços

Lista de serviços (nome/duração/preço).

CRUD completo.

2.6 Configurações

Preferências da conta.

Tema (dark fixo).

Gerenciamento básico.

3. Componentes do Design System

Todos os componentes devem estar em /components, com CSS isolado.

3.1 Button

Variantes: primário / secundário / destrutivo / ícone.

Área de toque mínima: 44×44 px (padrão WCAG e Apple HIG).

Sem bordas nativas.

Ação clara ao toque (hover/tap).

3.2 Card

background: #1E1E1E

border-radius: 12px

Padding minimalista

Deve aceitar conteúdo flexível (agendamento, cliente, serviço).

3.3 Input

Full-width

Alto contraste

Tamanho confortável

Placeholder suave (cinza #737373)

Sem autofill amarelo do Chrome (CSS reset).

3.4 Modal

Radix UI → acessibilidade garantida

Backdrop escuro opaco

Animações suaves (fade/scale)

3.5 Toast

Radix Toast

Inferior, cor de acordo com estado

Curto (3–4s)

3.6 DnDItem (agendamento)

Componente isolado com sua própria lógica de drag.

A tela Home não deve ter a lógica de DnD — apenas usar o componente.

4. Regras de Usabilidade

Baseadas em Fitts, Gestalt, Nielsen e mobile-first moderno.

Touch target ≥ 44px

Feedback imediato (toast, estados, animações sutis)

Gestos precisam ser consistentes (direita = concluir, esquerda = cancelar)

Ordem deve refletir backend sempre

Reconhecimento acima de memória → informações sempre visíveis

Não sobrecarregar com texto → cards simples, diretos

Travar zoom e highlight para parecer app nativo

5. Restrições de Comportamento (Ergonomia Mobile)
5.1 Bloqueios obrigatórios

Desabilitar double tap zoom.

Desabilitar pinch-zoom.

Desabilitar copy/paste global.

Permitir copy/paste somente em inputs e campos de busca.

Desabilitar highlight azul (usando -webkit-tap-highlight-color: transparent;).

Tudo isso é ergonomia, não segurança.

6. Interação com o Backend

O front não deve ter lógica avançada de negócio — apenas:

consumir rotas

atualizar store local

refletir ordenações

exibir feedback

sincronizar posição após drag

DnD envia:

PATCH /agendamentos/:id
{ position: novaPosicao }


Para trocas entre itens, o backend já ajusta horário e ordem.

7. Diretrizes de Como a IA deve Gerar Código

Nunca misturar:

lógica de rotas

lógica do DnD

layout da página

Para qualquer tela gerada, a IA deve:

gerar apenas HTML + Svelte + CSS Modules

importar componentes já existentes

manter a UI limpa, escura e minimalista

não usar Tailwind ou Bootstrap

não gerar estilos inline

nunca colocar lógica de drag dentro da rota: deve sempre vir de /features/dnd

Para ícones, sempre usar Iconify:

import Icon from "@iconify/svelte";

8. Navegação entre Telas

Simples, clara, inferior, sempre visível.
Nada de comportar-se como website.

Touch Targets e Ergonomia

Todo elemento interativo deve possuir área mínima de toque de 44×44 dp (Apple HIG) ou 48×48 dp (Material Design), independentemente do tamanho visual do botão.

Deve existir área ativa estendida (“hit area”) ao redor do botão, garantindo execução confortável mesmo com redução de precisão motora.

A área clicável deve ser maior que o contorno visual para sensação de “botão acolchoado”, sem alterar a estética minimalista.

Evitar elementos com interação dependente de precisão milimétrica.

Padrão obrigatório em toda interface (cards, ícones, botões de ação, drag handlers).

Feedback Tátil e Visual

Interações devem transmitir sensação de profundidade, como se fossem elementos “amortecidos” ao toque:

leve escala (0.97)

leve sombra interna

transição curta (100–150ms)

Isto simula fisicamente o “acolchoamento”.

Manifesto finalizado.

6. Dependências Obrigatórias — Regras de Uso (Refatorado)

Estas bibliotecas constituem a base oficial do projeto.
Sua utilização é mandatória sempre que suas funcionalidades forem requeridas.

Nenhum componente, página ou utilitário pode reimplementar lógica já fornecida por alguma dessas dependências.

6.1 Gestão de Requisições — Axios (Obrigatório)

Todas as chamadas HTTP devem utilizar exclusivamente Axios.

Criar um módulo central: /api/api.ts, contendo:

baseURL

interceptors para erros e autenticação

timeouts

Proibido utilizar fetch() em qualquer parte do projeto.

As páginas nunca chamam Axios diretamente; devem utilizar módulos dedicados em /api/*.

6.2 Datas — Dayjs (Obrigatório)

Toda lógica envolvendo datas deve usar Dayjs:

formatação

comparação

criação de horários

adição/subtração de minutos

validações

Proibido usar new Date() para manipulação ou formatação.

Formatos padronizados:

"HH:mm"

"YYYY-MM-DD"

"YYYY-MM-DDTHH:mm:ss"

6.3 Rotas SPA — svelte-routing (Obrigatório)

O sistema de rotas deve usar exclusivamente svelte-routing.

Deve existir um único arquivo de rotas: /routes/index.ts.

Navegação padrão:

<Link to="/...">

navigate("/...")

Proibido criar roteadores alternativos ou manipular window.location.

As páginas devem permanecer puras: nenhuma lógica de rota dentro das páginas.

6.4 Ícones — FontAwesome Free (Obrigatório)

Todos os ícones devem vir exclusivamente de:

fas (solid)

far (regular)

fab (brands)

Proibido usar SVGs externos para ações primárias ou ícones funcionais.

SVGs customizados permitidos apenas para logotipo/identidade (ex.: ícone do app na Welcome Screen).

6.5 Drag and Drop — @dnd-kit (Obrigatório)

O sistema de reorganização da agenda é um pilar central do produto; portanto, deve utilizar sempre @dnd-kit:

Requisitos obrigatórios:

Reordenação vertical via @dnd-kit/sortable

Animação suave durante drag

Detecção de colisão correta em listas compactas

Suporte mobile completo:

TouchSensor

gestos horizontais (swipe → cancelar/concluir)

Proibido implementar DnD manualmente ou com bibliotecas alternativas.

Arquitetura obrigatória:

/components/dnd/DndContextWrapper.svelte
/components/dnd/SortableList.svelte
/components/dnd/SortableItem.svelte


Funções obrigatórias no wrapper:

onDragStart

onDragEnd

onDragCancel

6.6 Arquitetura de Componentes (Obrigatória)

Separação rígida entre camadas:

/pages/*      — telas puras, sem lógica pesada
/components/ui/*  — botões, inputs, cards
/components/dnd/* — abstrações do dnd-kit
/api/*        — comunicação com backend via Axios
/lib/*        — utilidades (datas, status, máscaras)


Regras:

Páginas não podem conter lógica complexa.

Nenhum componente UI pode acessar Axios diretamente.

Funções de DnD nunca ficam dentro das páginas.

Rotas e DnD são camadas separadas.

6.7 Estilo — Sem Tailwind • Sem Bootstrap

Estilização deve seguir:

CSS modular (.css ou .scss)

Tema dark-first, inspirado em:

Spotify


Interface com aparência de app instalado, não de site.

Regras estéticas obrigatórias:

Botões e áreas interativas acolchoadas
(padding amplo, ergonomia mobile).

Zonas clicáveis com mínimo 44×44 px.

Componentes devem parecer “touch-friendly”.

Bordas suaves e sombras sutis.

Ícones com espaçamento consistente.

Proibido:

Tailwind

Bootstrap

Variáveis globais caóticas

6.8 Interações Mobile (Obrigatórias)

O aplicativo deve simular a experiência de um app nativo:

Bloquear zoom por double-tap

Bloquear seleção, copiar e colar globalmente

Permitir copy/paste apenas em:

inputs

campos de busca

Desabilitar menus padrão de browser em toques longos

Responder sempre a toque, arraste e swipe

Layout adaptado para ergonomia do polegar
(zonas de ação nos cantos inferiores priorizadas).