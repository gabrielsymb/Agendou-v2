<script lang="ts">
  export let size: number = 24;
  export let stroke: number = 2.5;
  export let color: string = 'var(--brand-600, #4facfe)';
</script>

<!-- Token-driven spinner: 24px, stroke 2.5, smooth 270deg sweep -->
<svg class="ag-spinner" width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style="color: {color};">
  <circle class="ag-spinner__bg" cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width={stroke} stroke-opacity="0.12" />
  <circle
    class="ag-spinner__arc"
    cx="12" cy="12" r="10"
    fill="none"
    stroke="currentColor"
    stroke-width={stroke}
    stroke-linecap="round"
    stroke-dasharray="48 64"
    stroke-dashoffset="64"
  />
</svg>

<style>
  .ag-spinner { display: inline-block; vertical-align: middle; color: var(--brand-600, #4facfe); }

  .ag-spinner__arc {
    transform-origin: 50% 50%;
    animation: ag-spin-arc--v4 var(--anim-duration-medium, 280ms) cubic-bezier(.2,.9,.2,1) infinite;
    will-change: transform, stroke-dashoffset;
  }

  /* rotate while subtly modulating dashoffset to avoid overshoot */
  @keyframes ag-spin-arc--v4 {
    0% { transform: rotate(0deg); stroke-dashoffset: 64; }
    50% { transform: rotate(180deg); stroke-dashoffset: 32; }
    100% { transform: rotate(360deg); stroke-dashoffset: 64; }
  }
</style>
