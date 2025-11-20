<script lang="ts">
  export let itemsLocal: any[] = [];
  export let activeId: string | number | null = null;
</script>

<ul class="sortable-list" role="list" data-count={itemsLocal.length} data-active-id={activeId}>
  <slot />
</ul>

<style>
  .sortable-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  /* highlight the item that is the current drop target (overId) */
  :global(.sortable-list[data-active-id]) > :global(li[data-dnd-id]) {
    transition: background-color .12s ease, border-color .12s ease;
  }
  :global(.sortable-list[data-active-id]) > :global(li[data-dnd-id][data-active="true"]) {
    background: color-mix(in srgb, var(--color-primary-050) 18%, transparent);
    border: 1px dashed color-mix(in srgb, var(--color-primary-200) 30%, transparent);
    transform: translateY(2px);
  }
</style>
