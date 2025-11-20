<script lang="ts">
  export let title = 'Nada por aqui';
  export let subtitle = '';
  // icon is provided via named slot; no exported prop required
</script>

<section class="empty-state" role="status">
  <div class="icon" aria-hidden="true">
    <slot name="icon">
      <!-- default placeholder circle -->
      <svg width="72" height="72" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)"/></svg>
    </slot>
  </div>
  <h3 class="title">{title}</h3>
  {#if subtitle}
    <p class="subtitle">{subtitle}</p>
  {/if}
  <div class="actions"><slot name="actions" /></div>
</section>

<style>
  .empty-state { display:flex; flex-direction:column; align-items:center; gap:12px; padding:24px; text-align:center; }
  .empty-state .icon { width: 96px; height: 96px; display:flex; align-items:center; justify-content:center; }
  .empty-state .title { margin:0; font-size:1.1rem; font-weight:600; }
  .empty-state .subtitle { margin:0; color:var(--color-text-muted); }
  .empty-state .actions { margin-top:8px; }
</style>
