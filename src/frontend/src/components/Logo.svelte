<script lang="ts">
  export let size: number = 64;
  const accent = 'var(--accent, #34d399)';
  const stroke = 'var(--logo-stroke, rgba(255,255,255,0.95))';
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 64 64"
  role="img"
  aria-label="Logotipo Agendou - calendário com A"
  xmlns="http://www.w3.org/2000/svg"
>
  <rect x="3" y="6" width="58" height="52" rx="8" fill="rgba(255,255,255,0.02)" />

  <rect class="top-fill" x="6" y="8" width="52" height="12" rx="4" fill={accent} opacity="0.12" />

  <rect
    class="cal-outline stroke-anim cal"
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

  <path
    class="stroke-anim a"
    d="M20 42 L32 20 L44 42 M25 32 L39 32"
    fill="none"
    stroke={accent}
    stroke-width="3"
    stroke-linecap="round"
    stroke-linejoin="round"
    pathLength="1"
  />

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

  .a {
    animation-duration: 0.95s; /* ligeiramente menor para terminar em ~1s com atraso */
    animation-delay: 0.05s;    /* pequeno atraso para sequência sutil */
  }

  @keyframes draw {
    to {
      stroke-dashoffset: 0;
    }
  }

  svg:hover .cal-outline {
    filter: drop-shadow(0 6px 10px rgba(0,0,0,0.35));
  }

  svg:hover .a {
    transform-origin: 32px 32px;
    animation-play-state: running;
  }

  .top-fill { transition: opacity 200ms ease; }

  @media (prefers-reduced-motion: reduce) {
    .stroke-anim { animation: none; stroke-dashoffset: 0; }
  }
</style>
