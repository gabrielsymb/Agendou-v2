<script lang="ts">
  export let id: string | number;
  export let item: any;
  export let activeId: string | number | null = null;

  $: isActive = activeId !== null && `${activeId}` === `${id}`;
</script>

<li class="sortable-item" data-dnd-id={id} role="listitem" data-active={isActive} class:is-active={isActive} data-item-id={item?.id}>
  <!-- botão interno é o elemento interativo; mantém toda a área clicável/focável -->
  <button class="sortable-button" type="button" aria-grabbed={isActive}>
    <slot />
  </button>
</li>

<style>
  .sortable-item { list-style: none; margin: 0; padding: 0; }
  .sortable-button {
    all: unset;
    display: block;
    width: 100%;
    text-align: left;
    cursor: grab;
    touch-action: none;
    user-select: none;
    -webkit-user-drag: none;
    padding: 0;
  }
  .sortable-button:active { cursor: grabbing; opacity: 0.98; }
</style>
