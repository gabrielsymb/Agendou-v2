<script lang="ts">
  import Skeleton from '../lib/components/Loader/Skeleton.svelte';
  export let rows = 3;
  export let rowHeight = '56px';
</script>

<ul class="skeleton-list" aria-hidden="true">
  {#each Array(rows) as _, i (i)}
    <li style="height:{rowHeight}"><Skeleton width="100%" height={rowHeight} radius="12px" /></li>
  {/each}
</ul>

<style>
  .skeleton-list { list-style:none; padding:0; margin:0; display:flex; flex-direction:column; gap:var(--skeleton-gap, 12px); }
  .skeleton-list li { list-style:none; }
</style>
