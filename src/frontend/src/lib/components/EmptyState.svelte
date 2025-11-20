<script lang="ts">
  export let title: string = '';
</script>

<div class="empty-state" role="status">
  <div class="empty-state__icon"><slot name="icon" /></div>
  {#if title}
    <h3 class="empty-state__title">{title}</h3>
  {/if}
  <div class="empty-state__desc"><slot /></div>
  <div class="empty-state__action">
    <slot name="action" />
    <slot name="actions" />
  </div>
</div>

<style>
  .empty-state {
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    text-align:center;
    padding: 1.25rem;
    gap: 0.75rem;
  }
  .empty-state__icon { width: 72px; height: 72px; display:flex; align-items:center; justify-content:center; }
  .empty-state__title { margin:0; font-weight:600; color:var(--color-text-primary, #E6EEF8); }
  .empty-state__desc { color:var(--color-muted, rgba(255,255,255,0.6)); }
  .empty-state__action { margin-top: .5rem; }
</style>
