<script lang="ts">
  export let ag: any = null;
  export let isDragging: boolean = false;
  export let overId: string | number | null = null;
</script>

<article class="agenda-item" data-id={ag?.id} class:dragging={isDragging} class:over={overId === ag?.id}>
  <div class="content">
    <div class="title">{ag?.cliente?.nome ?? ag?.title ?? 'Agendamento'}</div>
    {#if ag?.hora}
      <div class="meta">{ag.hora}</div>
    {/if}
  </div>
  <slot />
</article>

<style>
  .agenda-item {
    display: block;
    padding: 0.75rem;
    border-radius: 12px;
    background: var(--color-card, #fff);
    margin-bottom: 0.5rem;
    box-shadow: var(--shadow-soft);
    transition: transform 120ms ease, opacity 120ms ease;
  }

  .agenda-item.dragging { opacity: 0.6; }

  .content .title {
    font-weight: 600;
    color: var(--color-text-primary, #2C2C2C);
  }

  .content .meta {
    font-size: 0.85rem;
    color: var(--color-text-secondary, #6A6A6A);
  }
</style>
