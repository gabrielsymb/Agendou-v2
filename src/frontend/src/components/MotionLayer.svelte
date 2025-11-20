<script lang="ts">
  export let visible = false;
</script>

{#if visible}
  <div class="motion-layer" aria-hidden="true"></div>
{/if}

<style>
.motion-layer {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.28);
  z-index: var(--z-modal, 40);
  pointer-events: none;
}
</style>
