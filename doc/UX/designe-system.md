DESIGN SYSTEM — “AGENDOU UI”

Foco: velocidade cognitiva, fluidez, microinterações e navegação gestual.

1. Tipografia

Fonte primária: Inter (já instalada).

Uso	Peso	Tamanho
Título principal	600	22–24px
Título seção	600	18px
Texto padrão	400	15–16px
Texto secundário	400	13–14px
Labels/UI	500	12–13px

Regras científicas (HCI):
Microtipografia com Inter melhora legibilidade em telas pequenas (Carney & Levin).
Evite pesos 700+ no mobile para não “pesar” visualmente a interface.

2. Paleta oficial

Use toda a paleta. São papéis funcionais diferentes dentro do sistema.

Base

Fundo principal: #F4F3F1

Fundo secundário (superfícies): #FFFFFF

Borda/sombras suaves: rgba(0,0,0,0.08)

Texto

Primário: #2C2C2C

Secundário: #6A6A6A

Desabilitado: rgba(44,44,44,0.35)

Acentos quentes (energia leve)

Use APENAS em:

pills ativas,

estados de swipe (cancelar/concluir),

botões primários,

indicadores animados.

Salmão suave: #FF7957
Coral claro: #FF8A70
Terracota moderna: #E46B4C

Regra:

primário = #FF7957

hover/ativo = #E46B4C

estados informativos (swipe indicators) = #FF8A70

3. Ícones — Set oficial

Use Iconify + Material Symbols Rounded (outlined).

Motivos científicos:

traço uniforme e previsível → melhor suporte a animações

geometria suave → ideal para pills animadas

leitura rápida → menor carga cognitiva em mobile

Exemplos:

Home → material-symbols:home-rounded

Calendar → material-symbols:event-rounded

Add → material-symbols:add-rounded

Check → material-symbols:check-rounded

Close → material-symbols:close-rounded

Edit → material-symbols:edit-rounded

Arrow left/right/up → material-symbols:arrow_back_ios_new-rounded

Regra de tamanho:

tabbar icon: 22–24px

icones de swipe: 20px

ícones inline: 16–18px

4. Componentes principais
4.1. Tabbar (mobile-first)
Propriedades:

altura: 60–64px

fundo: #FFFFFF

sombra superior: rgba(0,0,0,0.06) 0 -2px 6px

Elementos:

Pill dinâmica para item ativo

background: #FF7957

padding horizontal: 14–18px

borda: 999px (pill)

transição: 180–250ms (ease-out)

ícone cresce de 22px → 24px

label aparece com fade-slide 90ms

Microinteração:

regex visual do Instagram modernizado:

clique → pill expande

ícone dá um micro-scale 1.05

label aparece

4.2. Swipe Cards (core do app)

Mesmo que não use “cards” estéticos, o padrão lógico é este.

Regra de usabilidade (Fitts + Tognazzini):
o gesto precisa ser autoexplicativo antes de ser executado.

Estados visuais:

Swipe para esquerda (cancelar)

fundo de apoio: #FF8A70

ícone: arrow_back

opacidade aparece progressiva conforme arrasto

distância mínima: 20–25% do width

Swipe para direita (concluir)

fundo de apoio: #E46B4C

ícone: check

mesma lógica

Swipe para cima (editar)

fundo de apoio: #FF7957

ícone: edit

movimento vertical de 18–20px mostra intenção

Regra:

O indicador visual aparece ANTES da ação disparar.

4.3. Lista de agendamentos (mobile-first)

Como você quer lista sem card visual:

Componente:

altura mínima item: 58–64px

fundo: #FFFFFF

border-radius: 10px

padding: 12–16px

margem vertical: 8px

sombra: rgba(0,0,0,0.03) 0 1px 3px

Conteúdo:

nome cliente → 15–16px, 500

horário → 14px, 400

status chip → pill pequena com cor contextual

5. Animações

Nada abrupto. Tudo com easing suave.

Transições recomendadas:

ease-out suave: cubic-bezier(0.16, 1, 0.3, 1)

fade-slide: deslocamento 4–6px

micro-scale: 1.00 → 1.05

Duração:

Interações pequenas: 120–180ms

Navegação tabbar: 180–240ms

Mudança login ↔ register: 250–300ms

Mudança login → register (problema que você citou)

Use:

fade-slide horizontal (4–8px)

suavização para esconder o acréscimo de campos

manter o container com altura fluida ANIMADA (não instantânea)

6. Navegação por swipe horizontal

Regra de usabilidade:

Só telas irmãs dentro do mesmo contexto podem swipar entre si.

Ou seja:

área pública (login/register) → NÃO permite swipe para entrar na home

área privada (home/agenda/detalhes) → pode ter swipe lateral para trocar tabs

Direita ↔ Esquerda:

troca de abas

pill acompanha o gesto

tabbar pode opcionalmente ter um “track progress” discreto (como stories)

7. Sistema de feedback visual

Elementos essenciais:

7.1. Pill de status

concluído: verde suave (#4CAF50) com ícone check

cancelado: #FF8A70

pendente: cinza médio (#6A6A6A)

7.2. Indicadores de gesto

Quando começa a arrastar, aparece no canto:

ícone

pequena pill com feedback

opacidade progressiva com delta do movimento

8. Grid e layout responsivo
Mobile (principal)

largura container: 100%

spacing: 12–16px

lista ocupa quase toda a tela

Tablet

largura container: 80–88%

aumento das fontes +1px

tabbar maior (70px)

Desktop

largura container: 540–760px

centralizado

lista mantenha natureza mobile (não vire app de dashboard!)

Regra científica:

Preservar o modelo mental mobile maximiza eficiência operacional (Nielsen’s consistency heuristic).

9. Identidade visual

Seu app é:

leve

humano

rápido

gesto-centrado

sem excesso de cores

minimalista caloroso (tons quentes, suaves)

Resumo:

“Uma superfície branca suave, com detalhes quentes e feedback visual perfeitamente animado.”