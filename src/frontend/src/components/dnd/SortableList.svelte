<script lang="ts">
  export let itemsLocal: any[] = [];
</script>

<ul class="sortable-list" role="list" data-count={itemsLocal.length}>
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
</style>
