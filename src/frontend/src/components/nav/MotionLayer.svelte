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
    backdrop-filter: blur(4px);
    background: rgba(255,255,255,0.02);
    transition: opacity 200ms ease-out;
    pointer-events: none;
  }
</style>
