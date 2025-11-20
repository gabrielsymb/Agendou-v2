<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { dndzone } from 'svelte-dnd-action';

  export let items: any[] = [];

  const dispatch = createEventDispatcher();
  let itemsLocal: any[] = items ? items.slice() : [];

  $: if (items && JSON.stringify(items) !== JSON.stringify(itemsLocal)) {
    itemsLocal = items.slice();
  }

  function handleConsider(e: CustomEvent) {
    // e.detail.items é a nova ordem visual durante o drag
    itemsLocal = e.detail.items;
    dispatch('change', { items: itemsLocal });
    // notify dragging state and placeholder index
    dispatch('dragging', { activeId: e.detail.active?.id ?? null, overId: e.detail.over?.id ?? null });
  }

  function handleFinalize(e: CustomEvent) {
    // finalize fornece a nova ordem definitiva
    itemsLocal = e.detail.items;
    const orderedIds = itemsLocal.map((i: any) => i.id);
    dispatch('reorder', { orderedIds, items: itemsLocal });
    dispatch('dragging', { activeId: null, overId: null });
  }
</script>

<div use:dndzone={{ items: itemsLocal, flipDurationMs: 180 }} on:consider={handleConsider} on:finalize={handleFinalize} class="dnd-wrapper">
  <slot {itemsLocal} />
</div>

<style>
  .dnd-wrapper { display: block; }
</style>
