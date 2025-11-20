<script lang="ts">
  import DndContextWrapper from '../dnd/DndContextWrapper.svelte';
  import SortableList from '../dnd/SortableList.svelte';
  import SortableItem from '../dnd/SortableItem.svelte';
  import AgendaItem from './AgendaItem.svelte';
  import { createEventDispatcher } from 'svelte';

  export let items: any[] = [];
  const dispatch = createEventDispatcher();
  let activeId: string | number | null = null;
  let overId: string | number | null = null;

  function onReorder(e: CustomEvent) {
    dispatch('reorder', e.detail);
  }

  function onDragging(e: CustomEvent) {
    activeId = e.detail.activeId ?? null;
    overId = e.detail.overId ?? null;
  }
</script>

<DndContextWrapper {items} on:reorder={onReorder} on:change={(e) => { items = e.detail.items }} on:dragging={onDragging} let:itemsLocal>
  <SortableList {itemsLocal} {activeId}>
    {#each itemsLocal as ag (ag.id)}
      <SortableItem id={ag.id} item={ag} activeId={activeId}>
        <AgendaItem {ag} isDragging={activeId === ag.id} {overId} />
      </SortableItem>
    {/each}
  </SortableList>
</DndContextWrapper>

<style>
  :global(.sortable-list) { padding: 8px 0; }
  :global(.sortable-item .sortable-button) { padding: 0.25rem 0; }
</style>
