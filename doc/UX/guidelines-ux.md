1. LAYOUT E ESPAÇAMENTO
-----------------------------------------------------------
1.1. Grade Responsiva (Mobile First)

Base científica: grid modular reduz carga cognitiva e aumenta a previsibilidade.

Mobile (principal):
4 colunas – gutter de 16px – margens 20px.
Justificativa: máximo de legibilidade e "tato" em telas pequenas.

Tablet:
8 colunas – gutter 20px – margens 24px.

Desktop:
12 colunas – gutter 24px – margens 32px.

Nunca permita elementos encostarem nas bordas.
Isso melhora tocabilidade, reduz erros de toque (Fitts) e cria ritmo visual.

1.2. Espaçamento Vertical

Baseado no “4-8-12-16-20-24” (sua escala real de tokens).

Títulos → 24px acima

Sessões → 20px

Botões → 16px

Inputs → 12px

Isso deve ser seguido rigidamente para uniformidade.

1.3. Altura de Elementos Interativos

Mínimo real científico: 44px (Apple), ideal: 48px (W3C).

Use 48px como padrão para botões, inputs, itens de lista e pill da tabbar.

-----------------------------------------------------------
2. TIPOGRAFIA
-----------------------------------------------------------
2.1. Inter — Hierarquia Oficial

Título da tela: --font-size-xl (20px), peso 600

Subtítulo / Seção: --font-size-lg (18px), peso 500

Corpo: --font-size-md (16px), peso 400

Suporte / labels: --font-size-sm (14px), peso 400

Microtexto (evitar): --font-size-xs (12px)

Mantém acessibilidade, contraste e ritmo.

2.2. Regra de Ouro da Legibilidade

Todo texto primário deve usar neutral-800.
Todo texto secundário deve usar neutral-600.

Nada de preto absoluto (#000).
A literatura mostra queda de conforto visual.

-----------------------------------------------------------
3. CORES E CONTRASTE
-----------------------------------------------------------
3.1. Tema claro

Fundo principal: neutral-100
Superfícies: neutral-000
Sombra: shadow-xs ou shadow-sm

Isso cria a textura “calma” que você gosta (Calm UI).

3.2. Acento quente

Regra: acento NUNCA é plano.
Sempre acompanhado de sombra suave ou gradiente mínimo (se quiser).

Meta científica: gerar affordance e direcionamento sem agressividade.

3.3. Limite de uso de acento

elementos primários (botões de ação)

destaque do dia/horário

pill ativo na tabbar

feedback positivo (arrastou completou → verde poderia ser substituído pelo acento quente, dependendo da narrativa visual)

Nunca usar acento em mais de 1 elemento por tela além do indispensável.

-----------------------------------------------------------
4. ÍCONES E SIMBOLOGIA
-----------------------------------------------------------
4.1. Pacotes permitidos

FontAwesome Free

Iconify (recomendado, enorme biblioteca)

Você deve padronizar espessura:

Regra profissional:
→ Use apenas “outlined” ou apenas “sharp”.
Evite misturar outline/filled.

O estilo outline funciona melhor para aplicativos leves e utilitários.

4.2. Tamanhos fixos
--component-icon-size-md = 18px (padrão)


Maior apenas em:

modal de ação

swipe visual indicator

tabbar

4.3. Regras de entendimento imediato

Princípios de affordance e mapeamento de Norman:

seta → movimento

check → conclusão

x → cancelamento

relógio → agendamento

lápis → edição

três linhas → arrastar/ordenar

mão/slider → swipe disponível

Você deve reforçar visualmente a ação antes de ela ser executada.

-----------------------------------------------------------
5. COMPONENTES (COMPORTAMENTO)
-----------------------------------------------------------
📌 5.1. LISTA DE AGENDAMENTOS
5.1.1. Estrutura

altura 64–72px

avatar opcional

nome e horário sempre visíveis

status em badge menor

arrasto horizontal (swipe) com fundo animado

5.1.2. Swipe Left / Right (seu coração)

Base científica: microafirmação visual reduz erros (Nielsen, Heurística 6).

ANTES do swipe acionar:

fundo começa a surgir gradualmente

ícone aparece antes do texto

texto opcional: “Concluir” / “Cancelar”

DEPOIS do threshold (64px):

cor acento/danger fica sólida

card vibra levemente (2px amplitude — easing emphasized)

Tudo isso reduz incerteza. O usuário “sente” o momento certo.

5.1.3. Swipe Up (abrir modal de edição)

Comportamento mais avançado.

pilha do card sobe 16–24px

sombreamento aumenta (shadow-md)

modal sobe do bottom

É importante manter baixo atrito.

-----------------------------------------------------------
6. TABBAR COM PILL ANIMADA
-----------------------------------------------------------
6.1. Estrutura

altura mínima de 64px

fundo superfície clara

sombra xs

ícones no estilo outline

pill ativa com cor de acento

6.2. Animação da Pill

Baseada em Framer Motion / Keylines do Material.

pill se move horizontalmente

transição: --duration-base + --easing-emphasized

ícone aumenta de 18px → 22px

texto aparece com fade (apenas no ativo)

6.3. Swipe entre abas

Permitido apenas nas telas internas logadas.

Regra científica:
Swipe lateral só é recomendado quando:

contexto é paralelo (ex.: páginas irmãs),

não há risco de navegação acidental,

a ação é reversível.

No seu caso:

✔ Home ↔ Agenda ↔ Perfil
✘ Login ↔ Register ↔ Home (não pode)

-----------------------------------------------------------
7. ANIMAÇÕES E MICROINTERAÇÕES
-----------------------------------------------------------
7.1. Tipos recomendados

fade suave

slide curto

scale leve (max 1.04)

“spring” mínimo na entrada do modal

micro-vibração no swipe concluído

7.2. Durações

Use tokens:

ações diretas: 120ms

mudanças de tela/tab: 180ms

modais: 260ms

7.3. Lei do Menor Esforço (Hick & Fitts)

Todas as interações precisam:

menos de 2 toques

resposta visual imediata

feedback sempre presente

Sua abordagem com swipe é cientificamente superior a botões pequenos.

-----------------------------------------------------------
8. ACESSIBILIDADE
-----------------------------------------------------------
8.1. Contraste

WCAG AA:

texto normal → 4.5:1

texto grande → 3:1

ícones críticos → 3:1

Sua paleta atende bem.

8.2. Alvos minimamente 48px

Obrigatório.

8.3. Texto nunca abaixo de 14px

Exceção: badges.

-----------------------------------------------------------
9. NAVEGAÇÃO
-----------------------------------------------------------
9.1. Comportamento das telas

Login e Register → navegação apenas por botão

Telas internas → tabbar + swipe lateral

Modais → swipe down para fechar (se fizer sentido)

9.2. Mantenha consistência forte

É a base de um sistema confiável.

-----------------------------------------------------------
10. TONS EMOCIONAIS / SENSORY DESIGN
-----------------------------------------------------------

Você falou que “sou alucinado por um bom designer”.
Aqui está a parte que diferencia design comum de design profissional.

10.1. Calm UI (o estilo que você gosta)

Isso significa:

superfícies limpas

sombras suaves

cores quentes e humanas

poucos elementos agressivos

microinterações constantes

sem ruído

sem bordas duras

10.2. Narrativa visual

Acento quente = humano
Neutros = paz
Espaço = clareza
Animações = vida

Essa coerência tem base científica: reduz carga mental e aumenta recall.

-----------------------------------------------------------
11. CONSULTA RÁPIDA (TL;DR)
-----------------------------------------------------------

Seu design deve sempre parecer:

leve

quente

humano

previsível

animado

responsivo

visualmente explicativo

E nunca:

preto total

azul saturado

quadrado rígido

estático

abrupto

com muitos toques