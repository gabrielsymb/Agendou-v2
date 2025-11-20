<script lang="ts">
  export let size: number = 64;
  export let animated: boolean = true;
  export let white: boolean = false;
  const accent = white ? 'var(--color-text-inverse, #FFFFFF)' : 'var(--color-accent-primary, #FF7957)';
  const stroke = white ? 'var(--color-text-inverse, #FFFFFF)' : 'var(--logo-stroke, rgba(44,44,44,0.12))';
</script>
<svg
  width={size}
  height={size}
  viewBox="0 0 64 64"
  role="img"
  aria-label="Logotipo Agendou - calendário com A"
  xmlns="http://www.w3.org/2000/svg"
>
  <rect x="3" y="6" width="58" height="52" rx="8" fill="var(--color-surface-2, rgba(0,0,0,0.02))" />

  <rect class="top-fill" x="6" y="8" width="52" height="12" rx="4" fill={accent} opacity="0.14" />

  <rect
    class="cal-outline {animated ? 'stroke-anim cal' : ''}"
    x="6"
    y="16"
    width="52"
    height="38"
    rx="6"
    fill="none"
    stroke={stroke}
    stroke-width="2"
    pathLength="1"
  />

  <g class="rings">
    <rect x="14" y="6" width="6" height="4" rx="1" fill={accent} opacity="0.95" />
    <rect x="44" y="6" width="6" height="4" rx="1" fill={accent} opacity="0.95" />
  </g>

  <!-- Use text for logo so it matches app typography; lowercase 'a' + exclamation -->
  <g class="logo-text" transform="translate(32,34)">
  <!-- lowercase 'a' rendered as text to match global font -->
  <text class="logo-a" x="-8" y="4" fill={accent} font-family="'Inter',sans-serif" font-weight="600" font-size="18">a</text>
  <!-- exclamation, slightly larger and closer; animates when `animated` is true -->
  <text class="logo-ex {animated ? 'ex-anim' : ''}" x="12" y="-2" fill={accent} font-family="'Inter',sans-serif" font-weight="700" font-size="22">!</text>
  </g>

  <g class="grid" stroke={stroke} stroke-width="0.8" opacity="0.12">
    <circle cx="22" cy="26" r="0.8" fill={stroke} />
    <circle cx="30" cy="26" r="0.8" fill={stroke} />
    <circle cx="38" cy="26" r="0.8" fill={stroke} />
  </g>
</svg>

<style>
  :global(.logo) { display:flex; align-items:center; justify-content:center; }

  /* objetivo:
     - todo o ícone fica desenhado aos 1s
     - depois faz reverse (apagar) no próximo 1s
     - loop infinito (2s total por ciclo)
  */

  .stroke-anim {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation-name: draw;
    animation-timing-function: ease-in-out;
    animation-iteration-count: infinite;
    animation-direction: alternate; /* desenha então reverte */
    animation-fill-mode: both;
  }

  /* garantir que o último traço termine exatamente aos 1s */
  /* duração por direção = 1s (desenhar) -> alternate produz apagar em 1s -> ciclo 2s */
  .cal {
    animation-duration: 1s;
    animation-delay: 0s; /* começa imediatamente */
  }

  /* removed old path-based animation selectors; text-based logo uses .ex-anim */

  /* text logo styling */
  .logo-text text { dominant-baseline: middle; text-anchor: middle; }
  .logo-a { font-smooth: always; }
  .logo-ex { transform-origin: center; }
  .ex-anim { animation-name: draw; animation-duration: 0.9s; animation-timing-function: ease-in-out; animation-iteration-count: infinite; animation-direction: alternate; }

  @keyframes draw {
    to {
      stroke-dashoffset: 0;
    }
  }

  svg:hover .cal-outline { filter: drop-shadow(0 6px 10px rgba(0,0,0,0.35)); }

  .top-fill { transition: opacity 200ms ease; }

  @media (prefers-reduced-motion: reduce) {
    .stroke-anim { animation: none; stroke-dashoffset: 0; }
  }



  /*  OBS! Animado (padrão): <Logo />
Estático: <Logo animated={false} />*/


</style>
