<script lang="ts">
  export let width: string = '100%';
  export let height: string = '12px';
  export let radius: string = '12px';
</script>

<div class="ag-skeleton" style="width: {width}; height: {height}; border-radius: {radius};" aria-hidden="true"></div>

<style>
  .ag-skeleton {
    background: var(--surface-200, #1f1f1f);
    position: relative;
    overflow: hidden;
    display: block;
  }

  .ag-skeleton::after {
    content: '';
    position: absolute;
    top: 0; left: -120%;
    height: 100%;
    width: 220%;
    /* subtle multi-stop ramp to avoid hard bands */
    background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.12), rgba(255,255,255,0.2), rgba(255,255,255,0));
    animation: ag-shimmer--v4 var(--anim-shimmer, 1300ms) linear infinite;
    transform: translateX(0);
    will-change: transform, opacity;
  }

  @keyframes ag-shimmer--v4 {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(50%); }
  }
</style>
