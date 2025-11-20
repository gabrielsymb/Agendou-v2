<script lang="ts">
  export let size: number | string | undefined = undefined;
  export let stroke: number | string | undefined = undefined;
  export let color: string | undefined = undefined;
  // fallback to tokens/defaults if props not provided
  const _size = size ?? 'var(--loader-size, 32px)';
  const _stroke = stroke ?? 2.5;
  const _color = color ?? 'var(--spinner-on-primary, currentColor)';
</script>

<span class="ag-spinner" style="display:inline-flex; width: {_size}; height: {_size}; color: {_color};">
  <svg viewBox="0 0 24 24" width={_size} height={_size} aria-hidden="true" focusable="false">
    <circle
      cx="12" cy="12" r="9"
      fill="none"
      stroke="currentColor"
      stroke-width={_stroke}
      stroke-linecap="round"
      stroke-dasharray="56.55 56.55"
      stroke-dashoffset="42.41"
      class="ag-spinner-arc"
    />
  </svg>
</span>

<style>
  .ag-spinner { align-items:center; justify-content:center; }
  .ag-spinner-arc {
    transform-origin: 50% 50%;
    animation: ag-spin-arc var(--anim-duration-medium, 280ms) cubic-bezier(.45,0,.55,1) infinite;
  }
  @keyframes ag-spin-arc {
    0%   { transform: rotate(0deg); stroke-dashoffset: 42.41; }
    50%  { transform: rotate(180deg); stroke-dashoffset: 14.14; }
    100% { transform: rotate(360deg); stroke-dashoffset: 42.41; }
  }
</style>
