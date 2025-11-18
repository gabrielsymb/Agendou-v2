<script lang="ts">
  import Inner from '../../../components/Button.svelte';
</script>

<svelte:component this={Inner} {...$$restProps}>
  <slot />
</svelte:component>
