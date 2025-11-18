<script lang="ts">
  import Inner from '../../../components/Card.svelte';
</script>

<svelte:component this={Inner} {...$$restProps}>
  <slot />
</svelte:component>
