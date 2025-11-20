<script lang="ts">
  import Skeleton from '../lib/components/Loader/Skeleton.svelte';
  export let rows: number = 3;
  export let items: number | undefined = undefined; // alias for rows for compatibility
  export let rowHeight = '56px';

  // if items provided, use it as the number of rows
  $: count = (typeof items === 'number' ? items : rows);
</script>

<ul class="skeleton-list" aria-hidden="true">
  {#each Array(count) as _, i (i)}
    <li style="height: {rowHeight}"><Skeleton width="100%" height={rowHeight} radius="12px" /></li>
  {/each}
</ul>

<style>
  .skeleton-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:var(--skeleton-gap, 1rem); }
  .skeleton-list li { list-style:none; }
</style>
